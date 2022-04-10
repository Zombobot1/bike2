import { Bytes } from 'firebase/firestore'
import { deleteIdeaUpdates, sendIdeaUpdate } from '../../fb/ideaChangesAPI'
import { SendUPageUpdate } from '../../fb/upageChangesAPI'
import { f, str, bool, strs, num } from '../../utils/types'
import { uuid, uuidS } from '../../utils/wrappers/uuid'
import { FocusType } from '../editing/types'
import { fileUploader } from '../editing/UFile/FileUploader'
import { isUFormBlock, UBlockData, UBlockType } from '../editing/UPage/ublockTypes'
import { UFormEvent, UFormRuntime } from '../editing/UPage/UPageState/crdtParser/UPageRuntimeTree'
import { getInitialIdeaState, mergeUpdates } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { UPageCursor } from '../editing/UPage/UPageState/types'
import { UEditor, UEditorI } from '../editing/UPage/UPageState/UEditor'
import { IdeaData } from './types'
import { _getIdeaState, _IdeaStates } from './_stubs'
import { useData } from '../../fb/useData'
import { useEffect, useState } from 'react'
import useUpdateEffect from '../utils/hooks/useUpdateEffect'
import { setIdeaChanger, useSetUPageCursor, useSetUPageInfo } from '../editing/UPage/useUPageInfo'
import { IdeaDTO, UPageChangeDescriptionDTO } from '../../fb/FSSchema'

export interface IdeaEditor extends UEditorI {
  handleUCardEvent: (e: UFormEvent) => bool
}

export class IdeaState implements IdeaEditor {
  #editor: UEditor
  #collector: IdeaChangesCollector

  constructor(
    id: str,
    updates: Bytes[],
    {
      editing = false,
      addImage = fileUploader.prepareUpload,
      deleteFiles = fileUploader.delete,
      sendUpdate = sendIdeaUpdate,
      deleteUpdates = deleteIdeaUpdates,
      getId = uuid,
    } = {},
  ) {
    this.#collector = new IdeaChangesCollector(id, sendUpdate)
    if (editing && !updates.length) {
      updates = getInitialIdeaState()
      this.#collector.interceptUpdate('', updates[0], { date: 0, preview: [], sha: '', user: '', upageId: '' })
    }

    this.#editor = new UEditor({
      id,
      updates,
      addImage,
      deleteFiles,
      deleteUpdates,
      getId,
      onPageAdded: f,
      onPagesDeleted: f,
      sendUpdate: this.#collector.interceptUpdate,
    })

    if (editing) {
      const data = this.#editor._getRoot() as IdeaData
      const formBlock = data.ublocks.find((b) => isUFormBlock(b.type))
      UFormRuntime.toggleEdit(data, formBlock ? [formBlock] : [])
    }
  }

  get state(): State {
    return this.#editor.state as State
  }

  globalContext = () => 'ucard' as const

  readonly = () => false // TODO: if user doesn't have write access to page it is true

  handleUCardEvent = (e: UFormEvent) => {
    let success = true

    this.#editor._runtimeChange((_, d) => {
      const data = d as IdeaData
      const formBlock = data.ublocks.find((b) => isUFormBlock(b.type))

      if (!formBlock && data.$state === 'editing') {
        data.$error = BAD_IDEA
        success = false
        return
      }
      if (!formBlock) return

      if (e === 'submit') return UFormRuntime.submit(data, [formBlock])

      // if (e === 'toggle-edit')
      const prevState = data.$state
      const isValid = UFormRuntime.toggleEdit(data, [formBlock])
      if (prevState === 'editing' && isValid) this.#collector.sendToServer()
      else if (!isValid) {
        success = false
        data.$error = BAD_IDEA
      }

      if (isValid && data.$error) data.$error = ''
    })

    return success
  }

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
}

export const BAD_IDEA = 'Add question and provide answer!'

interface Update {
  update: Bytes
  description: UPageChangeDescriptionDTO
}

class IdeaChangesCollector {
  collectedUpdates: Update[] = []

  constructor(public id: str, public sendUpdate: SendUPageUpdate) {}

  interceptUpdate: SendUPageUpdate = (_, update, description) => this.collectedUpdates.push({ update, description })
  sendToServer = () => {
    if (!this.collectedUpdates.length) return
    mergeUpdates(this.id, this.collectedUpdates, this.sendUpdate)
    this.collectedUpdates = []
  }
}

interface State {
  data: IdeaData
  cursor: UPageCursor
}

export function useIdeaState(id: str, upageId: str, { create = false, editing = false }) {
  const [ideaUpdates] = useData('ideas', id, create ? { ...new IdeaDTO(), upageId } : undefined)

  const [changer] = useState(() => new IdeaState(id, ideaUpdates.updates, { editing: create || editing }))
  const [state, setState] = useState(changer.state)
  changer.setStateSetter(setState)

  useUpdateEffect(() => changer.applyUpdate(ideaUpdates.updates), [ideaUpdates])

  const { setCursor } = useSetUPageCursor()
  useEffect(() => setCursor(state.cursor), [state.cursor])

  const { setUPageInfo } = useSetUPageInfo()
  useEffect(() => setUPageInfo({ readonly: changer.readonly() }), [changer.readonly()]) // always matches upage readonly-ness

  setIdeaChanger(changer)

  return {
    data: state.data,
    changer: changer,
  }
}

export function _ideaS(init: _IdeaStates, { editing = false, id = 0, sendUpdate = f as SendUPageUpdate } = {}) {
  return new IdeaState('ideaId', _getIdeaState(init), {
    editing,
    getId: uuidS(id),
    addImage: f,
    deleteFiles: f,
    sendUpdate,
  })
}
