import { Bytes } from 'firebase/firestore'
import produce from 'immer'
import { useState, useEffect } from 'react'
import { cls } from '../../../../fb/cls'
import { deleteUPageUpdates, moveBlocks, sendUPageUpdate } from '../../../../fb/upageChangesAPI'
import { useData } from '../../../../fb/useData'
import { safeSplit } from '../../../../utils/algorithms'
import { bool, f, num, SetStrs, str, strs } from '../../../../utils/types'
import { isStr, rnd, safe } from '../../../../utils/utils'
import { uuid } from '../../../../utils/wrappers/uuid'
import { UPageManagement } from '../../../application/Workspace/Workspace'
import { useC } from '../../../utils/hooks/hooks'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { FocusType, NewBlockFocus } from '../../types'
import { fileUploader } from '../../UFile/FileUploader'
import {
  isAdvancedText,
  isStringBasedBlock,
  isUTextBlock,
  UBlockContext,
  UBlockData,
  UBlocks,
  UBlockType,
  UListData,
  UPageData,
  UPageDTO,
  UPageFlags,
} from '../ublockTypes'
import { useSetUPageCursor, useSetUPageInfo, setUPageChanger } from '../useUPageInfo'
import { getInitialUPageState, UPageChange, UPageStateCR } from './crdtParser/UPageStateCR'
import { ChangePreview, getDeletedBlocksPreview, previewMaker, PreviewTag } from './crdtParser/previewGeneration'
import { triggerUListOpen } from './crdtParser/ulistManagement'
import { nameNestedPages, RuntimeDataKeeper, UFormEvent } from './crdtParser/UPageRuntimeTree'
import { bfsUBlocks, OnPageAdded, OnPagesDeleted, UPageTree } from './crdtParser/UPageTree'
import { TOCs, UPageCursor, UPageStateMutation } from './types'
import { useNavigate } from 'react-router'

export class UPageState implements UPageStateMutation {
  #cr: UPageStateCR
  #tree: UPageTree

  #state: State = { cursor: new UPageCursor(), data: { ublocks: [] } as UPageData }
  #setState: (s: State) => void = f

  #addImage: (id: str, blobUrl: str) => void // other files are added outside this class
  #deleteFiles: SetStrs
  #getId: (options?: { long?: bool }) => str

  #sendUpdate = sendUPageUpdate
  #handleMoveToPage: (pageId: str, handleMove: (pageUpdates: Bytes[]) => void) => void

  #onPageAdded: OnPageAdded // both should be async (e.g. useState setter)
  #onPagesDeleted: OnPagesDeleted

  constructor(
    id: str,
    updates: Bytes[],
    onPageAdded: OnPageAdded,
    onPagesDeleted: OnPagesDeleted,
    getPageName: (id: str) => str,
    handleMoveToPage = moveBlocks,
    {
      addImage = fileUploader.prepareUpload,
      deleteFiles = fileUploader.delete,
      sendUpdate = sendUPageUpdate,
      deleteUpdates = deleteUPageUpdates,
      getId = uuid,
    } = {},
  ) {
    this.#getId = ({ long = false } = {}) => getId({ short: !long })

    this.#cr = new UPageStateCR(id, updates, sendUpdate, deleteUpdates)
    this.#state.data = this.#cr.state

    this.#addImage = addImage
    this.#deleteFiles = deleteFiles

    this.#sendUpdate = sendUpdate
    this.#handleMoveToPage = handleMoveToPage

    this.#onPageAdded = onPageAdded
    this.#onPagesDeleted = onPagesDeleted

    // this.#remakeTree() // webpack build fails
    this.#tree = new UPageTree(this.#state.data, this.#getId, onPageAdded, onPagesDeleted, deleteFiles)

    // TODO: trigger state update on page rename in NavBar
    nameNestedPages(this.#tree.bfs, getPageName)
  }

  get state(): State {
    return this.#state
  }

  setStateSetter = (s: (s: State) => void) => (this.#setState = s)

  handleUFormEvent = (uformId: str, e: UFormEvent) => this.#runtimeChange((tree) => tree.handleUFormEvent(uformId, e))

  deriveTOC = (): TOCs => this.#tree.deriveTOC()

  context = (id: str): UBlockContext => this.#tree.context(id)

  readonly = () => false // TODO: add flag to UPage, manage permissions

  applyUpdate = (updates: Bytes[]) => {
    const newState = this.#cr.applyUpdate(updates)
    this.#handleCRChange(newState)
  }

  undo = () => {
    const newState = this.#cr.undo()
    this.#handleCRChange(newState)
  }

  redo = () => {
    const newState = this.#cr.undo()
    this.#handleCRChange(newState)
  }

  rollBackTo = (sha: str) => {
    const newState = this.#cr.rollBackTo(sha)
    this.#handleCRChange(newState, { keepRuntimeData: false })
  }

  select = (...ids: strs) => {
    this.#changeCursor((c) => c.selected.push(...ids))
  }

  selectAll = () => {
    this.#changeCursor((c) => (c.selected = this.#tree.getAllSelectableBlockIds()))
  }

  onSelectionEnter = () => {
    if (this.#state.cursor.selected.length) {
      const lastBlock = this.#tree.getUBlock(safe(this.#state.cursor.selected.at(-1)))

      if (isUTextBlock(lastBlock.type)) this.#changeCursor((c) => (c.focus = { id: lastBlock.id, type: 'end' }))
      else this.add(lastBlock.id)

      this.#changeCursor((c) => (c.selected = []))
    }
  }

  unselect = () => {
    this.#changeCursor((c) => (c.selected = []))
  }

  onDragStart = () => {
    this.#changeCursor((c) => (c.isDragging = true))
  }

  onDragEnd = () => {
    this.#changeCursor((c) => (c.isDragging = false))
  }

  resetFocus = () => {
    this.#changeCursor((c) => (c.focus = undefined))
  }

  moveFocusUp = (id = '', xOffset?: num) => {
    this.#changeCursor((c) => (c.focus = { id: this.#tree.moveFocusUp(id), type: 'end', xOffset }))
  }

  moveFocusDown = (id = '', xOffset?: num) => {
    this.#changeCursor((c) => (c.focus = { id: this.#tree.moveFocusDown(id), type: 'start', xOffset }))
  }

  rearrange = (underId = 'title') =>
    this.#change((tree) => ({
      changes: tree.rearrange(underId, this.#state.cursor.selected),
      preview: previewMaker.bold('Rearranged blocks'),
      blockId: underId,
    }))

  createUGrid = (id: str, side: 'right' | 'left') =>
    this.#change((tree) => {
      const preview = tree.isNotNested(id) ? 'Added grid' : 'Added grid column'
      const changes = tree.createGrid(id, this.#state.cursor.selected, side)
      return { changes, preview: previewMaker.bold(preview), blockId: this.#state.cursor.selected[0] }
    })

  moveTo = (pageId: str) => {
    const movingBlocks = this.#state.cursor.selected.map((id) => this.#tree.getUBlock(id))
    const blocksPreview = getDeletedBlocksPreview(movingBlocks)
    const update = this.#change((tree) => {
      const changes = tree.remove(this.#state.cursor.selected, { moveTo: pageId })
      return {
        changes,
        preview: previewMaker.bold('Organized blocks into grid', blocksPreview),
        blockId: this.#state.cursor.selected[0],
      }
    })

    this.deleteSelected({ moveTo: pageId })
    this.unselect()

    this.#handleMoveToPage(pageId, (pageUpdates: Bytes[]) => {
      const page = new UPageStateCR(pageId, pageUpdates, this.#sendUpdate, f)
      page.append(movingBlocks)
    })

    return update
  }

  change = (id: str, newData: Partial<UBlockData>) =>
    // preview is empty because it's not possible to calculate changes here, only in crdt
    this.#change((tree) => ({ changes: tree.change(id, newData), preview: [], blockId: id }))

  changeRuntimeData = (changes: [str, UBlockData][]) => this.#runtimeChange((t) => t.changeRuntimeData(changes))

  changeType = (id: str, type: UBlockType, data?: str, focus: FocusType = 'end') =>
    this.#change((tree, cursor) => {
      cursor.focus = { id, type: focus }
      return {
        changes: tree.changeType(id, type, data),
        blockId: id,
        preview: previewMaker.bold(`Changed type to ${type}`),
      }
    })

  add = (underId: str, type: UBlockType = 'text') =>
    this.#change((tree, cursor) => {
      let id = ''

      const r = {
        changes: tree.addBlock(underId, type, (newId) => (id = newId)),
        preview: previewMaker.bold(`Added ${type}`),
        blockId: id,
      }

      if (isUTextBlock(type)) cursor.focus = { id, type: 'start' }

      return r
    })

  deleteSelected = ({ moveTo = '' } = {}) => {
    const { selected } = this.#state.cursor
    const blocks = selected.map((id) => this.#tree.getUBlock(id))

    const preview = getDeletedBlocksPreview(blocks)
    return this.#change((tree, cursor) => {
      cursor.selected = []
      return { changes: tree.remove(selected, { moveTo }), preview }
    })
  }

  onUTextTab = (id: str, data: str) =>
    this.#change((tree) => ({
      changes: tree.onUTextTab(id, data),
      preview: previewMaker.bold('Moved block right'),
      blockId: id,
    }))

  onUTextShiftTab = (id: str, data: str) =>
    this.#change((tree) => ({
      changes: tree.onUTextTab(id, data),
      preview: previewMaker.bold('Moved block left'),
      blockId: id,
    }))

  onUTextBackspace = (id: str, data: str) =>
    this.#change((tree, cursor) => {
      let preview = previewMaker.bold('UText backspace') // it will be overridden
      const block = tree.getUBlock(id)
      if (isStr(block.data)) {
        const dataStr = block.data as str
        if (dataStr.length && !data.length) preview = [previewMaker.dotsAfter(dataStr, PreviewTag.s)]
        else if (data.length)
          preview = previewMaker.bold('Moved text upper', [previewMaker.dotsAfter(data, PreviewTag.em)])
        else if (!dataStr.length && !data.length) preview = previewMaker.bold('Deleted empty block')
      }

      const changes = tree.onUTextBackspace(id, data, (id, xOffset) => {
        if (!id && xOffset === -1) cursor.focus = { id: 'title', type: 'end' }
        else if (xOffset) cursor.focus = { id, type: 'end-integer', xOffset }
        else cursor.focus = { id, type: 'end' }
      })

      return { changes, preview }
    })

  onUTextEnter = (dataAbove: str, dataBelow: str, underId: str) =>
    this.#change((tree, cursor) => {
      let preview = previewMaker.bold('Added text')
      if (dataBelow) preview = previewMaker.bold('Moved text below', [previewMaker.dotsAfter(dataBelow, PreviewTag.em)])
      let newId = ''
      // chs instead of changes due to strange typescript error
      const chs = tree.onUTextEnter(dataAbove, dataBelow, underId, (id) => {
        newId = id
        cursor.focus = { id, type: 'start' }
      })

      return { changes: chs, preview, blockId: newId }
    })

  onUTextPaste = (data: str, underId: str, type: UBlockType = 'text') =>
    this.#addNewBlocks(underId, this.#tree.getParent(underId)?.id, data, type)

  onFactoryEnter = (parentId = 'r') =>
    this.#addNewBlocks(this.#tree.getLastId(parentId), parentId, '', 'text', 'factory')
  onFactoryChange = (data: str, type: UBlockType, parentId = 'r') =>
    this.#addNewBlocks(this.#tree.getLastId(parentId), parentId, data, type, 'focus-end', { fresh: true })

  triggerUListOpen = (id: str) =>
    this.#runtimeChange((tree) => {
      const list = tree.getParent(id)
      triggerUListOpen(list.data as UListData, id)
    })

  insertUnderSelected = () => {
    const underId = safe(this.#state.cursor.selected.at(-1))
    this.#changeCursor((c) => (c.selected = []))
    return this.#addNewBlocks(underId, this.#tree.getParent(underId).id)
  }

  getSelectedData = (): str => {
    const blocks = this.#state.cursor.selected.map((id) => this.#tree.getUBlock(id))
    const texts = blocks.map((b) => {
      if (isStringBasedBlock(b.type)) return b.data as str
      if (isAdvancedText(b.type)) return (b.data as { text: str }).text
      return ''
    })
    return texts.filter(Boolean).join('\n\n')
  }

  triggerFullWidth = () => this.#flag('fullWidth')
  triggerTurnOffTOC = () => this.#flag('turnOffTOC')

  #handleCRChange = (newState?: UPageData, { keepRuntimeData = true } = {}) => {
    if (!newState) return

    const srcBefore = this.#tree.getAllSrc()

    if (keepRuntimeData) {
      const keeper = new RuntimeDataKeeper(this.#tree.bfs)
      this.#remakeTree(newState)
      keeper.transferRuntimeData(this.#tree)
    } else this.#remakeTree(newState)

    const srcAfter = this.#tree.getAllSrc()
    const deletedSrc = srcBefore.filter((src) => !srcAfter.includes(src))
    if (deletedSrc.length) this.#deleteFiles(deletedSrc)

    this.#state = { ...this.#state }
    this.#state.data = newState
    this.#setState(this.#state)
  }

  #addNewBlocks = (
    underId: str,
    parentId = '',
    data = '',
    type: UBlockType = 'text',
    focus: NewBlockFocus | 'factory' = 'no-focus',
    { fresh = false } = {}, // signals to open autocomplete on / enter in factory
  ) =>
    this.#change((tree, cursor) => {
      let ids = [] as strs
      const changes = tree.onUTextPaste(underId, parentId, data, type, this.#addImage, (newIds) => (ids = newIds))
      let preview = [] as ChangePreview

      if (type === 'image') {
        cursor.focus = undefined
        cursor.selected = [ids[0]]

        preview = previewMaker.bold('Added image')
      } else {
        if (ids.length > 1) {
          cursor.focus = undefined
          cursor.selected = ids
        } else if (focus === 'factory') {
          cursor.focus = { id: 'factory', type: 'start' }
        } else if (focus !== 'no-focus') {
          cursor.focus = { id: safe(ids.at(-1)), type: focus === 'focus-start' ? 'start' : 'end' }
          if (fresh) cursor.focus.fresh = true
        }

        safeSplit(data, '\n\n').forEach((block) => {
          preview.push(previewMaker.dotsAfter(block, PreviewTag.em), previewMaker.br())
        })

        if (preview.length) preview.pop()
      }

      return { changes, preview, blockId: ids[0] }
    })

  #change = (f: (tree: UPageTree, cursor: UPageCursor) => UPageChange) => {
    this.#state = produce(this.#state, (draft) => {
      this.#remakeTree(draft.data)
      this.#cr.change(f(this.#tree, draft.cursor)) // should be inside otherwise immer revokes proxies and data is not available in crdt
    })
    this.#remakeTree()
    this.#setState(this.#state)
  }

  #runtimeChange = (f: (tree: UPageTree) => void) => {
    this.#state = produce(this.#state, (draft) => {
      this.#remakeTree(draft.data)
      f(this.#tree)
    })
    this.#remakeTree()
    this.#setState(this.#state)
  }

  #flag = (name: keyof UPageFlags) => {
    const newState = { ...this.#state.data }
    newState[name] = !newState[name]
    const change: UPageChange = {
      changes: [{ t: 'trigger-flag', name, type: this.#state.data[name] ? 'unset' : 'set' }],
      preview: previewMaker.bold(`Changed ${name}`),
    }
    this.#state.data = newState
    this.#cr.change(change)
    this.#setState({ ...this.#state })
  }

  #changeCursor = (f: (c: UPageCursor) => void) => {
    this.#state = produce(this.#state, (d) => {
      f(d.cursor)
    })
    this.#setState(this.#state)
  }

  #remakeTree = (data?: UPageData) => {
    this.#tree = new UPageTree(
      data || this.#state.data,
      this.#getId,
      this.#onPageAdded,
      this.#onPagesDeleted,
      this.#deleteFiles,
    )
  }

  _da = (id: str) => this.#tree.getUnsafeUBlock(id)?.data // access data from console
  _getTree = () => this.#tree
}

class State {
  data: UPageData = { ublocks: [] }
  cursor: UPageCursor = new UPageCursor()
}

export function useUPageState(id: str, workspace: UPageManagement) {
  const navigate = useNavigate()

  const [upageUpdates] = useData<UPageDTO>(cls.upages, id)
  const [newPage, setNewPage] = useState(() => ({ id: '', underPage: '' }))
  const [removedPages, setRemovedPages] = useState(() => ({ ids: [] as strs, moveTo: '' }))

  useEffect(() => {
    if (!newPage.id) return
    workspace.add(id, newPage.id, newPage.underPage)
    navigate('/' + newPage)
  }, [newPage])

  useEffect(() => {
    if (!removedPages.ids.length) return
    workspace.remove(removedPages.ids, { moveTo: removedPages.moveTo }) // TODO: remove current page
  }, [removedPages])

  const addNewPage = useC((id: str, underPage: str) => setNewPage({ id, underPage }))
  const removePages = useC((ids: strs, { moveTo = '' } = {}) => setRemovedPages({ ids, moveTo }))

  const [changer] = useState(() => new UPageState(id, upageUpdates.updates, addNewPage, removePages, workspace.name))
  const [state, setState] = useState(changer.state)
  changer.setStateSetter(setState)

  useUpdateEffect(() => changer.applyUpdate(upageUpdates.updates), [upageUpdates])

  const { setCursor } = useSetUPageCursor()
  useEffect(() => setCursor(state.cursor), [state.cursor])

  const { setUPageInfo } = useSetUPageInfo()
  useEffect(() => setUPageInfo({ readonly: changer.readonly() }), [changer.readonly()])

  setUPageChanger(changer)

  return {
    data: state.data,
    changer: changer,
  }
}

export function _generateTestUPage(data: UPageData): Bytes[] {
  const dto = { updates: getInitialUPageState() }
  const cr = new UPageStateCR('', [...dto.updates], (_, u) => dto.updates.push(u), f)

  cr.change({ changes: [{ t: 'insert', ublocks: bfsUBlocks(data.ublocks) }], preview: [] })
  cr.change({ changes: [{ t: 'change', id: 'r', data: { ublocks: data.ublocks } }], preview: [] })

  return dto.updates
}

export class _TestUPageState extends UPageState {
  constructor(data: UPageData) {
    const getName = () => randomNames[rnd(randomNames.length)]
    const keeper = new RuntimeDataKeeper(bfsUBlocks(data.ublocks))
    super('', _generateTestUPage(data), f, f, getName, () => Promise.resolve(), {
      sendUpdate: f,
      deleteUpdates: f,
      deleteFiles: f,
    })
    keeper.transferRuntimeData(this._getTree())
  }
}

export function useTestUPageState(ublocks: UBlocks) {
  const [changer] = useState(() => new _TestUPageState({ ublocks }))
  const [state, setState] = useState(changer.state)
  changer.setStateSetter(setState)

  const { setCursor } = useSetUPageCursor()
  useEffect(() => setCursor(state.cursor), [state.cursor])

  const { setUPageInfo } = useSetUPageInfo()
  useEffect(() => setUPageInfo({ readonly: changer.readonly() }), [changer.readonly()])

  setUPageChanger(changer)

  return {
    ublocks: state.data.ublocks,
    changer: changer,
  }
}

const randomNames = [
  'Rabbit Declares War',
  'Cheerleader Declares War',
  'Local Girl Invades Earth',
  'Rapper Predicts The Future',
  'Teen Mom Suspected Of Murder',
  'Teen Mom Predicts The Future',
  'Prisoner Discovers A New Island',
  'Dentist Escapes From London Zoo',
  'Prisoner Escapes From London Zoo',
  'Local Boy Caught Stealing Bananas',
  'Billionaire Blamed For Earthquake',
  'Teen Mom Catches A Deadly Disease',
  'Doctor Voted Most Annoying Person',
  'Baby Lama Caught Stealing Bananas',
  '1 Year Old Caught Stealing Bananas',
  'Dentist Wins Weightlifting Contest',
  'Firefighter Discovers A New Planet',
]
