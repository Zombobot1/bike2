import { useAtom, atom } from 'jotai'
import { useMount } from '../../utils/hooks/hooks'
import { sslugify } from '../../../utils/sslugify'
import { Fn, fn, str } from '../../../utils/types'
import { uuid } from '../../../utils/uuid'

type FileOrStr = File | str

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
    return data.map((fd) => (fd.name === previewName ? { ...fd, error: 'Please fill this field' } : fd))
  return []
}

export function newCardDataToFormData(data: NewCardData): FormData {
  const result = new FormData()
  data.forEach((fd) => result.append(fd.name, fd.value))
  return result
}

const newCardDataA = atom<NewCardData>([])

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
      if (isValid()) {
        const data = renameFiles(
          newCardData.filter((d) => d.value),
          previewName,
        )
        submitHandler(data)
      }
    },
    setNewCardData,
    newCardData,
  }
}

export function useNewCardDataField(_id: str, name: str) {
  const [newCardData, setNewCardData] = useAtom(newCardDataA)
  const setNewValue = _id ? fn : (value: FileOrStr) => setNewCardData((fd) => setFieldValue(fd, name, value))

  useMount(() => {
    if (_id) return
    setNewCardData((cd) => [...cd, { name, value: '', error: '' }])
    return () => setNewCardData((cd) => cd.filter((d) => d.name !== name))
  })

  const newData = newCardData.find((d) => d.name === name)
  return { setNewValue, newValue: newData?.value || '', error: newData?.error || '' }
}

function renameFiles(data: NewCardData, previewName: str): NewCardData {
  const preview = data.find((d) => d.name === previewName)
  if (!preview || preview.value instanceof File) throw new Error('Preview not found in new data')
  const name = (ext: str) => `${sslugify(preview.value as str)}-${uuid.v4()}.${ext}`

  return data.map((d) => {
    if (d instanceof File) {
      const ext = d.name.split('.').pop()
      if (!ext) throw new Error('File is missing an extension')
      return { ...d, value: new File([d], name(ext), { type: d.type }) }
    }
    return d
  })
}

const submitA = atom({ on: fn })

export function useSubmitNewCardData() {
  const [submit, setSubmit] = useAtom(submitA)
  return { submit: submit.on, setSubmit: (on: Fn) => setSubmit({ on }) }
}
