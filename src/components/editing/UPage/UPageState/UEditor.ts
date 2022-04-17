import { Bytes } from 'firebase/firestore'
import produce, { immerable, Patch } from 'immer'
import { ChangePreview, PreviewTag } from '../../../../fb/FSSchema'
import { DeleteUPageUpdates, SendUPageUpdate } from '../../../../fb/upageChangesAPI'
import { safeSplit } from '../../../../utils/algorithms'
import { str, num, Fn, strs, f, SetStrs, bool } from '../../../../utils/types'
import { safe, isStr } from '../../../../utils/utils'
import { FocusType, NewBlockFocus } from '../../types'
import {
  UBlockType,
  UBlockContext,
  UBlockData,
  WithUBlocks,
  UBlocks,
  isAdvancedText,
  isStringBasedBlock,
  isUTextBlock,
  UListData,
} from '../ublockTypes'
import { previewMaker, getDeletedBlocksPreview } from './crdtParser/previewGeneration'
import { triggerUListOpen } from './crdtParser/ulistManagement'
import { RuntimeDataKeeper } from './crdtParser/UPageRuntimeTree'
import { UPageChange, UPageStateCR } from './crdtParser/UPageStateCR'
import { OnPageAdded, OnPagesDeleted, UPageTree } from './crdtParser/UPageTree'
import { UPageCursor } from './types'

interface CursorMutation {
  moveFocusUp: (id?: str, xOffset?: num) => void
  moveFocusDown: (id?: str, xOffset?: num) => void
  resetFocus: Fn

  select: (...ids: strs) => void
  selectAll: Fn
  unselect: Fn
  onDragStart: Fn
  onDragEnd: Fn
}

interface BasicUBlocksManagement {
  rearrange: (underId?: str) => void
  add: (underId: str, type?: UBlockType) => void
  deleteSelected: (o?: { moveTo?: str }) => void
}

export interface UBlocksManagement extends BasicUBlocksManagement {
  createUGrid: (id: str, side: 'right' | 'left') => void
  moveTo: (pageId: str) => void
}

interface UPageStateLookup {
  context: (id: str) => UBlockContext
  getUPageId: () => str
  globalContext: () => 'ucard' | 'upage'
}

interface UTextEventHandlers {
  onUTextTab: (id: str, data: str) => void
  onUTextShiftTab: (id: str, data: str) => void
  onUTextBackspace: (id: str, data: str) => void
  onUTextEnter: (dataAbove: str, dataBelow: str, underId: str) => void
  onUTextPaste: (data: str, underId: str, type?: UBlockType) => void

  onFactoryChange: (data: str, type: UBlockType, parentId?: str) => void
  onFactoryEnter: (parentId?: str) => void
}

interface UBlockChange {
  change: (id: str, newData: Partial<UBlockData>) => void
  changeType: (id: str, type: UBlockType, data?: str, focus?: FocusType) => void

  triggerUListOpen: (id: str) => void
}

export interface UEditorI
  extends CursorMutation,
    BasicUBlocksManagement,
    UPageStateLookup,
    UTextEventHandlers,
    UBlockChange {}

type Constructor = {
  id: str
  updates: Bytes[]

  addImage: (id: str, blobUrl: str) => void
  deleteFiles: (ids: str | strs, upageId: str) => void

  sendUpdate: SendUPageUpdate
  deleteUpdates: DeleteUPageUpdates

  onPageAdded: OnPageAdded // both should be async (e.g. useState setter)
  onPagesDeleted: OnPagesDeleted

  getId: (o: { short?: bool }) => str
}

export class UEditor implements UEditorI {
  #id: str

  #cr: UPageStateCR
  #tree: UPageTree

  #state = new UEditorState()
  #setState: (state: UEditorState) => void = f

  #addImage: (id: str, blobUrl: str) => void // other files are added outside this class
  #deleteFiles: (src: strs, upageId: str) => void
  #getId: (options?: { long?: bool }) => str

  #onPageAdded: OnPageAdded
  #onPagesDeleted: OnPagesDeleted

  constructor(args: Constructor) {
    this.#getId = ({ long = false } = {}) => args.getId({ short: !long })
    this.#id = args.id

    this.#cr = new UPageStateCR(args.id, args.updates, args.sendUpdate, args.deleteUpdates)
    this.#state.data = this.#cr.state

    this.#addImage = args.addImage
    this.#deleteFiles = args.deleteFiles

    this.#onPageAdded = args.onPageAdded
    this.#onPagesDeleted = args.onPagesDeleted

    const { onPageAdded, onPagesDeleted, deleteFiles } = args
    this.#tree = new UPageTree(this.#state.data, this.#getId, onPageAdded, onPagesDeleted, (src) =>
      deleteFiles(src, this.#id),
    )
  }

  get state(): UEditorState {
    return this.#state
  }

  setStateSetter = (s: (s: UEditorState) => void) => (this.#setState = s)

  context = (id: str): UBlockContext => this.#tree.context(id)
  globalContext = () => 'upage' as const
  getUPageId = () => this.#id

  _applyPatch = (preview: ChangePreview, patches: Patch | Patch[]) => this.#cr._applyPatch(preview, patches)

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
    this._change((tree) => ({
      changes: tree.rearrange(underId, this.#state.cursor.selected),
      preview: previewMaker.bold('Rearranged blocks'),
      blockId: underId,
    }))

  change = (id: str, newData: Partial<UBlockData>) =>
    // preview is empty because it's not possible to calculate changes here, only in crdt
    this._change((tree) => ({ changes: tree.change(id, newData), preview: [], blockId: id }))

  changeType = (id: str, type: UBlockType, data?: str, focus: FocusType = 'end') =>
    this._change((tree, cursor) => {
      cursor.focus = { id, type: focus }
      return {
        changes: tree.changeType(id, type, data),
        blockId: id,
        preview: previewMaker.bold(`Changed type to ${type}`),
      }
    })

  add = (underId: str, type: UBlockType = 'text') =>
    this._change((tree, cursor) => {
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
    return this._change((tree, cursor) => {
      cursor.selected = []
      return { changes: tree.remove(selected, { moveTo }), preview }
    })
  }

  onUTextTab = (id: str, data: str) =>
    this._change((tree) => ({
      changes: tree.onUTextTab(id, data),
      preview: previewMaker.bold('Moved block right'),
      blockId: id,
    }))

  onUTextShiftTab = (id: str, data: str) =>
    this._change((tree) => ({
      changes: tree.onUTextTab(id, data),
      preview: previewMaker.bold('Moved block left'),
      blockId: id,
    }))

  onUTextBackspace = (id: str, data: str) =>
    this._change((tree, cursor) => {
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
    this._change((tree, cursor) => {
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
    this._runtimeChange((tree) => {
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

  #handleCRChange = (newState?: WithUBlocks, { keepRuntimeData = true } = {}) => {
    if (!newState) return

    const srcBefore = this.#tree.getAllSrc()

    if (keepRuntimeData) {
      const keeper = new RuntimeDataKeeper(this.#tree.bfs)
      this.#remakeTree(newState)
      keeper.transferRuntimeData(this.#tree)
    } else this.#remakeTree(newState)

    const srcAfter = this.#tree.getAllSrc()
    const deletedSrc = srcBefore.filter((src) => !srcAfter.includes(src))
    if (deletedSrc.length) this.#deleteFiles(deletedSrc, this.#id)

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
    this._change((tree, cursor) => {
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

  _change = (f: (tree: UPageTree, cursor: UPageCursor) => UPageChange) => {
    this.#state = produce(this.#state, (draft) => {
      this.#remakeTree(draft.data)
      this.#cr.change(f(this.#tree, draft.cursor)) // should be inside otherwise immer revokes proxies and data is not available in crdt
    })
    this.#remakeTree()
    this.#setState(this.#state)
  }

  _changeRootOnly = (f: (data: WithUBlocks) => UPageChange) => {
    this.#state = produce(this.#state, (draft) => {
      this.#cr.change(f(draft.data)) // do not change blocks!
    })
    this.#setState(this.#state)
  }

  _runtimeChange = (f: (tree: UPageTree, data: WithUBlocks) => void) => {
    this.#state = produce(this.#state, (draft) => {
      this.#remakeTree(draft.data)
      f(this.#tree, draft.data)
    })
    this.#remakeTree()
    this.#setState(this.#state)
  }

  #changeCursor = (f: (c: UPageCursor) => void) => {
    this.#state = produce(this.#state, (d) => {
      f(d.cursor)
    })
    this.#setState(this.#state)
  }

  #remakeTree = (data?: WithUBlocks) => {
    this.#tree = new UPageTree(data || this.#state.data, this.#getId, this.#onPageAdded, this.#onPagesDeleted, (src) =>
      this.#deleteFiles(src, this.#id),
    )
  }

  _da = (id: str) => this.#tree.getUnsafeUBlock(id)?.data // access data from console

  _getTree = () => this.#tree
  _getRoot = () => this.#state.data // immer will freeze data after its first change, but it's still possible to change it in constructor
}

export class UEditorState {
  [immerable] = true
  data = { ublocks: [] as UBlocks } as WithUBlocks
  cursor: UPageCursor = new UPageCursor()
}
