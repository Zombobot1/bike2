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
export type JSObjectStr = { [key: string]: string }

export type Fn = () => void
export const fn: Fn = () => {}
export const fnStr = (v: string): string => v

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Instantiable = { new (...args: any[]): any }
export interface WithId {
  _id: string
}

export type StateT<T> = [T, React.Dispatch<React.SetStateAction<T>>]
export type NumStateT = StateT<number>
export type StrStateT = StateT<string>
export type BoolStateT = StateT<boolean>

export type SX = JSObject
