import { ReactNode } from 'react'
import { Fn } from '../../utils/types'
import { getIds } from '../../utils/utils'

const id = getIds()

type RecP = {
  width?: number
  height?: number
  color?: string
  isHidden?: boolean
  _id?: string
  children?: ReactNode
  onClick?: Fn
}
export const Rec = ({
  height = 100,
  width = 200,
  color = 'red',
  isHidden = false,
  _id = id(),
  children,
  onClick,
}: RecP) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        display: isHidden ? 'none' : 'block',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
