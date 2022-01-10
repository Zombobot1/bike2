import { Fn, num } from '../../../utils/types'
import { useAtom } from 'jotai'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAtomTrigger(atom: any): [num, Fn] {
  const [value, setValue] = useAtom(atom)
  return [value as num, () => setValue((old: num) => old + 1)]
}
