import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { useMount } from '../../../utils/hooks-utils'
import { str } from '../../../utils/types'

type FileOrStr = File | str // empty str === deleted file

export interface FieldData {
  name: str
  value: FileOrStr
  error: str
}

export type NewCardData = FieldData[]

function setFieldValue(data: NewCardData, name: str, value: FileOrStr): NewCardData {
  return data.map((fd) => (fd.name === name ? { ...fd, value } : fd))
}

function checkError(data: NewCardData, previewName: str): NewCardData {
  const preview = data.find((fd) => fd.name === previewName)
  if (!preview || !preview.value)
    return data.map((fd) => (fd.name === previewName ? { ...fd, error: 'Please fill preview field' } : fd))
  return []
}

export function newCardDataToFormData(data: NewCardData): FormData {
  const result = new FormData()
  data.forEach((fd) => result.append(fd.name, fd.value))
  return result
}

const newCardDataA = atomWithReset<NewCardData>([])

export function useNewCardData(previewName: str) {
  const [newCardData, setNewCardData] = useAtom(newCardDataA)

  const isValid = () => {
    const validatedFields = checkError(newCardData, previewName)
    if (!validatedFields.length) return true
    setNewCardData(validatedFields)
    return false
  }

  return {
    submit: (submitHandler: (data: NewCardData) => void) => {
      if (isValid()) submitHandler(newCardData.filter((d) => d.value))
    },
  }
}

export function useNewCardDataField(name: str) {
  const [newCardData, setNewCardData] = useAtom(newCardDataA)
  const setValue = (value: FileOrStr) => setNewCardData((fd) => setFieldValue(fd, name, value))

  useMount(() => {
    setNewCardData((cd) => [...cd, { name, value: '', error: '' }])
    return () => setNewCardData((cd) => cd.filter((d) => d.name !== name))
  })

  return { setValue, error: newCardData.find((d) => d.name === name)?.error || '' }
}
