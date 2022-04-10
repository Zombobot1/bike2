import { Bytes } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { ChangePreview } from '../../../../fb/FSSchema'
import { deleteUPageUpdates, moveBlocks, SendUPageUpdate, sendUPageUpdate } from '../../../../fb/upageChangesAPI'
import { useData } from '../../../../fb/useData'
import { f, num, str, strs } from '../../../../utils/types'
import { rnd } from '../../../../utils/utils'
import { uuid, uuidS } from '../../../../utils/wrappers/uuid'
import { UPageManagement } from '../../../application/Workspace/WorkspaceState'
import { useC } from '../../../utils/hooks/hooks'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { FocusType } from '../../types'
import { fileUploader } from '../../UFile/FileUploader'
import { UBlockData, UBlocks, UBlockType, UPageData, UPageFlags } from '../ublockTypes'
import { useSetUPageCursor, useSetUPageInfo, setUPageChanger } from '../useUPageInfo'
import { getInitialUPageState, UPageChange, UPageStateCR } from './crdtParser/UPageStateCR'
import { getDeletedBlocksPreview, previewMaker } from './crdtParser/previewGeneration'
import { nameNestedPages, RuntimeDataKeeper, UPageUFormEvent, UPageUFormRuntime } from './crdtParser/UPageRuntimeTree'
import { bfsUBlocks, OnPageAdded, OnPagesDeleted } from './crdtParser/UPageTree'
import { TOCs, UPageCursor } from './types'
import { useNavigate } from 'react-router'
import { UBlocksManagement, UEditor, UEditorI } from './UEditor'
import { _UPageStates, _getUPageState } from './crdtParser/_stubs'

export interface UPageEditor extends UEditorI, UBlocksManagement {
  handleUFormEvent: (uformId: str, e: UPageUFormEvent) => void
  _da: (id: str) => UBlockData | undefined
}

export class UPageState implements UPageEditor {
  #editor: UEditor
  #sendUpdate: SendUPageUpdate
  #handleMoveToPage: (pageId: str, handleMove: (pageUpdates: Bytes[]) => void) => void

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
    this.#editor = new UEditor({
      id,
      updates,
      addImage,
      deleteFiles,
      deleteUpdates,
      getId,
      onPageAdded,
      onPagesDeleted,
      sendUpdate,
    })
    this.#sendUpdate = sendUpdate
    this.#handleMoveToPage = handleMoveToPage
    // TODO: trigger state update on page rename in NavBar
    nameNestedPages(this.#editor._getTree().bfs, getPageName)
  }

  get state(): State {
    return this.#editor.state as State
  }

  handleUFormEvent = (uformId: str, e: UPageUFormEvent) =>
    this.#editor._runtimeChange((tree) => {
      const uformRuntime = new UPageUFormRuntime(tree)
      if (e === 'submit') return uformRuntime.submit(uformId)
      if (e === 'retry') return uformRuntime.retry(uformId)
      if (e === 'toggle-edit') return uformRuntime.toggleEdit(uformId)
    })

  deriveTOC = (): TOCs => this.#editor._getTree().deriveTOC()

  readonly = () => false // TODO: add flag to UPage, manage permissions
  globalContext = () => 'upage' as const

  createUGrid = (id: str, side: 'right' | 'left') =>
    this.#editor._change((tree) => {
      const preview = tree.isNotNested(id) ? 'Added grid' : 'Added grid column'
      const changes = tree.createGrid(id, this.#editor.state.cursor.selected, side)
      return { changes, preview: previewMaker.bold(preview), blockId: this.#editor.state.cursor.selected[0] }
    })

  moveTo = (pageId: str) => {
    const movingBlocks = this.#editor.state.cursor.selected.map((id) => this.#editor._getTree().getUBlock(id))
    const blocksPreview = getDeletedBlocksPreview(movingBlocks)
    const update = this.#editor._change((tree) => {
      const changes = tree.remove(this.#editor.state.cursor.selected, { moveTo: pageId })
      return {
        changes,
        preview: previewMaker.bold('Organized blocks into grid', blocksPreview),
        blockId: this.#editor.state.cursor.selected[0],
      }
    })

    this.#editor.deleteSelected({ moveTo: pageId })
    this.#editor.unselect()

    this.#handleMoveToPage(pageId, (pageUpdates: Bytes[]) => {
      const page = new UPageStateCR(pageId, pageUpdates, this.#sendUpdate, f)
      page.append(movingBlocks)
    })

    return update
  }

  triggerFullWidth = () => this.#flag('fullWidth')
  triggerTurnOffTOC = () => this.#flag('turnOffTOC')

  context = (id: str) => this.#editor.context(id)

  setStateSetter = (s: (s: State) => void) => this.#editor.setStateSetter(s)

  applyUpdate = (updates: Bytes[]) => this.#editor.applyUpdate(updates)
  undo = () => this.#editor.undo()
  redo = () => this.#editor.redo()
  rollBackTo = (sha: str) => this.#editor.rollBackTo(sha)

  select = (...ids: strs) => this.#editor.select(...ids)
  selectAll = () => this.#editor.selectAll()
  onSelectionEnter = () => this.#editor.onSelectionEnter()
  unselect = () => this.#editor.unselect()

  onDragStart = () => this.#editor.onDragStart()
  onDragEnd = () => this.#editor.onDragEnd()

  resetFocus = () => this.#editor.resetFocus()
  moveFocusUp = (id = '', xOffset?: num) => this.#editor.moveFocusUp(id, xOffset)
  moveFocusDown = (id = '', xOffset?: num) => this.#editor.moveFocusDown(id, xOffset)
  rearrange = (underId = 'title') => this.#editor.rearrange(underId)

  change = (id: str, newData: Partial<UBlockData>) => this.#editor.change(id, newData)
  changeType = (id: str, type: UBlockType, data?: str, focus: FocusType = 'end') =>
    this.#editor.changeType(id, type, data, focus)

  add = (underId: str, type: UBlockType = 'text') => this.#editor.add(underId, type)
  deleteSelected = ({ moveTo = '' } = {}) => this.#editor.deleteSelected({ moveTo })

  onUTextTab = (id: str, data: str) => this.#editor.onUTextTab(id, data)
  onUTextShiftTab = (id: str, data: str) => this.#editor.onUTextShiftTab(id, data)
  onUTextBackspace = (id: str, data: str) => this.#editor.onUTextBackspace(id, data)
  onUTextEnter = (dataAbove: str, dataBelow: str, underId: str) =>
    this.#editor.onUTextEnter(dataAbove, dataBelow, underId)
  onUTextPaste = (data: str, underId: str, type: UBlockType = 'text') => this.#editor.onUTextPaste(data, underId, type)
  onFactoryEnter = (parentId = 'r') => this.#editor.onFactoryEnter(parentId)
  onFactoryChange = (data: str, type: UBlockType, parentId = 'r') => this.#editor.onFactoryChange(data, type, parentId)

  triggerUListOpen = (id: str) => this.#editor.triggerUListOpen(id)
  insertUnderSelected = () => this.#editor.insertUnderSelected()
  getSelectedData = (): str => this.#editor.getSelectedData()

  #flag = (name: keyof UPageFlags) => {
    this.#editor._changeRootOnly((d) => {
      const data = d as UPageData
      const oldFlag = data[name]
      data[name] = !data[name]

      return {
        changes: [{ t: 'trigger-flag', name, type: oldFlag ? 'unset' : 'set' }],
        preview: previewMaker.bold(`Changed ${name}`),
      } as UPageChange
    })
  }

  _da = (id: str) => this.#editor._da(id) // access data from console
  _getTree = () => this.#editor._getTree()
}

export function useUPageState(id: str, workspace: UPageManagement) {
  const navigate = useNavigate()

  const [upageUpdates] = useData('upages', id)
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

interface State {
  data: UPageData
  cursor: UPageCursor
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

export function _upageS(
  init: _UPageStates,
  { id = 1, addImage = f, deleteFiles = f, onPageAdded = f, onPagesDeleted = f } = {},
) {
  let preview = [] as ChangePreview
  return {
    page: new UPageState(
      'pageId',
      _getUPageState(init),
      onPageAdded,
      onPagesDeleted,
      () => '',
      () => Promise.resolve(),
      {
        addImage,
        deleteFiles,
        getId: uuidS(id),
        sendUpdate: (_, __, meta) => {
          preview = meta?.preview || []
        },
      },
    ),
    onPageAdded,
    onPagesDeleted,
    addImage,
    deleteFiles,
    preview: () => preview,
  }
}
