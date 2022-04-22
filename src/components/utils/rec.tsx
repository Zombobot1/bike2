import { ReactNode } from 'react'
import { bool, Fn } from '../../utils/types'
import { getIds, isStr } from '../../utils/utils'

const id = getIds()

type RecP = {
  width?: number
  height?: number | string
  color?: string
  isHidden?: boolean
  _id?: string
  children?: ReactNode
  onClick?: Fn
  stretch?: bool
}
export const Rec = ({
  height = 100,
  width = 200,
  color = 'green',
  isHidden = false,
  _id = id(),
  children,
  onClick,
  stretch,
}: RecP) => {
  return (
    <div
      style={{
        width: stretch ? '100%' : `${width}px`,
        height: stretch ? '100%' : `${height}${isStr(height) ? '' : 'px'}`,
        backgroundColor: color,
        display: isHidden ? 'none' : 'block',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
