import { Bytes } from 'firebase/firestore'
import { deleteIdeaUpdates, sendIdeaUpdate, setTraining } from '../../fb/ideaChangesAPI'
import { SendUPageUpdate } from '../../fb/upageChangesAPI'
import { f, str, bool, strs, num } from '../../utils/types'
import { uuid, uuidS } from '../../utils/wrappers/uuid'
import { FocusType } from '../editing/types'
import { fileUploader } from '../editing/UFile/FileUploader'
import { UBlockData, UBlockType } from '../editing/UPage/ublockTypes'
import { _mockServer } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { UPageCursor } from '../editing/UPage/UPageState/types'
import { UEditor, UEditorI } from '../editing/UPage/UPageState/UEditor'
import { IdeaData, IdeaRelatedData, IdeaType } from './types'
import { _getIdeaState, _IdeaStates } from './_stubs'
import { useData } from '../../fb/useData'
import { useEffect, useState } from 'react'
import useUpdateEffect from '../utils/hooks/useUpdateEffect'
import { setIdeaChanger, useSetUPageCursor, useSetUPageInfo } from '../editing/UPage/useUPageInfo'
import { IdeaDTO, TrainingIdAndDTO, UCardPriority } from '../../fb/FSSchema'
import { workspace } from '../application/Workspace/WorkspaceState'

import { Patch } from 'immer'
import { diffAsPatches } from '../../utils/wrappers/microdiffUtils'
import { IdeaRelatedState, PartialIdeaData, PartialTrainingData } from './IdeaRelatedState'
import { previewMaker } from '../editing/UPage/UPageState/crdtParser/previewGeneration'

export interface IdeaEditor extends UEditorI {
  save: () => bool
}

export class IdeaState implements IdeaEditor {
  #editor: UEditor
  #idea: IdeaRelatedState

  constructor(
    idea: PartialIdeaData & { updates: Bytes[] },
    training: PartialTrainingData,
    {
      addImage = fileUploader.prepareUpload,
      deleteFiles = fileUploader.delete,
      sendUpdate = sendIdeaUpdate,
      deleteUpdates = deleteIdeaUpdates,
      getId = uuid,
    } = {},
  ) {
    const { id, updates } = idea
    this.#idea = new IdeaRelatedState(idea, training, sendUpdate)
    updates.push(...this.#idea.initializeIfNew())

    this.#editor = new UEditor({
      id,
      updates,
      addImage,
      deleteFiles,
      deleteUpdates,
      getId,
      onPageAdded: f,
      onPagesDeleted: f,
      sendUpdate: this.#idea.interceptUpdate,
    })

    this.#idea.edit(this.#editor._getRoot() as IdeaData)
  }

  get state(): State {
    return this.#editor.state as State
  }

  hasUnsavedChanges = (): bool => this.#idea.hasUnsavedChanges

  globalContext = () => 'ucard' as const
  context = (id: str) => this.#editor.context(id)
  getUPageId = () => this.#editor.getUPageId()

  readonly = () => false // TODO: if user doesn't have write access to page it is true
  preview = (ucardId: str): str => this.#idea.preview(ucardId)
  toggleFreeze = (ucardId: str) => this.#idea.toggleFreeze(ucardId)

  changePriority = (ucardId: str, priority: UCardPriority) => this.#idea.changePriority(ucardId, priority)

  save = (): bool => {
    let success = true
    let changes: Patch[] = []
    const oldData: IdeaRelatedData = { ucards: (this.#editor._getRoot() as IdeaRelatedData).ucards }
    let newData = oldData

    this.#editor._runtimeChange((_, d) => {
      const update = this.#idea.save(d as IdeaData)
      newData = { ucards: update.ucards }
      success = update.success
    })

    if (success) {
      changes = diffAsPatches(oldData, newData)
      this.#editor._applyPatch(previewMaker.bold('Updated ucards'), changes)
    }

    return success
  }

  setType = (type: IdeaType) => {
    let changes: Patch[] = []
    const oldData: IdeaRelatedData = { type: (this.#editor._getRoot() as IdeaRelatedData).type }

    this.#editor._runtimeChange((_, d) => this.#idea.setType(d as IdeaData, type))

    changes = diffAsPatches(oldData, { type })
    this.#editor._applyPatch(previewMaker.bold('Changed idea type'), changes)
  }

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

interface State {
  data: IdeaData
  cursor: UPageCursor
}

export function useIdeaState(id: str, upageId: str, training?: TrainingIdAndDTO) {
  const ownerId = workspace.getOwner(upageId)
  const created = !!training
  const [ideaUpdates, setUpdates] = useData('ideas', id, !created ? { ...new IdeaDTO(), upageId } : undefined, {
    avoidCreation: !created,
  })

  const [changer] = useState(
    () =>
      new IdeaState(
        { id, createIdea: setUpdates, ownerId: ownerId, upageId, updates: ideaUpdates.updates },
        { training, setTraining },
      ),
  )
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

export function _mockIdeaServer(initialUpdates: Bytes[]) {
  const server = _mockServer(initialUpdates)
  const create = (dto: IdeaDTO) => server.updates.push(...dto.updates)
  return { ...server, create }
}

type Create = (dto: IdeaDTO) => void
export function _ideaS(
  init: _IdeaStates,
  {
    id = 0,
    sendUpdate = f as SendUPageUpdate,
    create = f as Create,
    updates = [] as Bytes[],
    training = undefined as TrainingIdAndDTO | undefined,
  } = {},
) {
  const initialUpdates = init === '' ? [] : _getIdeaState(init)
  updates = updates.length ? updates : initialUpdates
  return new IdeaState(
    { id: 'ideaId', ownerId: '', upageId: '', createIdea: create, updates },
    { training, setTraining: f },
    {
      getId: uuidS(id),
      addImage: f,
      deleteFiles: f,
      sendUpdate,
    },
  )
}
