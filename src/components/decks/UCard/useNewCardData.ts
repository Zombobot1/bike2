import { useAtom } from 'jotai'
import { atomWithReset, useResetAtom } from 'jotai/utils'

const newCardDataA = atomWithReset(new FormData())

export function useNewCardData() {
  const [newCardData, setNewCardData] = useAtom(newCardDataA)
  const resetNewCardData = useResetAtom(newCardDataA)

  return {
    newCardData,
    resetNewCardData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addField: (key: string, value: any) =>
      setNewCardData((fd) => {
        fd.append(key, value)
        return fd
      }),
  }
}
