// import React, { ReactNode } from 'react'

export type num = number
export type str = string
export type bool = boolean

export type strs = str[]
export type nums = num[]
export type Files = File[]

export type strP = Promise<str>
export type strsP = Promise<strs>
export type voidP = Promise<void>
export type FileP = Promise<File>

export type OBlob = Blob | null
export type OFile = File | null

export type OBlobP = Promise<OBlob>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSObject = { [key: string]: any }
export type OJSObject = JSObject | undefined
export type JSObjects = JSObject[]
export type JSObjectStr = { [key: string]: string }

export type Fn = () => void
export type Fns = Fn[]
export type SetStr = (s: str) => void
export type SetStrs = (s: strs) => void
export type SetBool = (s: bool) => void
export type SetNum = (s: num) => void

export const f: Fn = () => {}

export type SVGIcon = React.FC<React.SVGProps<SVGSVGElement>> & { title?: string | undefined }

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
export type State<T> = [T, SetState<T>]
export type NumState = State<number>
export type StrState = State<string>
export type BoolState = State<boolean>
export type Children = React.ReactNode
export type WithChildren = React.FC<{ children: Children }>
export type DivRef = React.RefObject<HTMLDivElement>
export type Subset<T, U extends T> = Extract<T, U>

export type OptionIconP = { fontSize: 'large' | 'medium' | 'small' | 'inherit' }
export type UIcon = React.FC<OptionIconP>
