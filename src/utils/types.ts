export type num = number
export type str = string
export type bool = boolean

export type strs = str[]
export type nums = num[]
export type Files = File[]

export type strP = Promise<str>
export type strsP = Promise<strs>
export type voidP = Promise<void>

export type OBlob = Blob | null
export type OFile = File | null

export type OBlobP = Promise<OBlob>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSObject = { [key: string]: any }
export type JSObjects = JSObject[]
export type JSObjectStr = { [key: string]: string }

export type Fn = () => void
export type SetStr = (s: str) => void
export type SetBool = (s: bool) => void
export type SetNum = (s: num) => void

export const fn: Fn = () => {}
export const setStr: SetStr = (_: str) => {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Instantiable = { new (...args: any[]): any }
export interface WithId {
  _id: string
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
export type State<T> = [T, SetState<T>]
export type NumState = State<number>
export type StrState = State<string>
export type BoolState = State<boolean>

export type Subset<T, U extends T> = Extract<T, U>
