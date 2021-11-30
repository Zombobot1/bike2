import { Box } from '@mui/system'
import { useRef, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import { SetStr } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { useMount } from '../hooks/hooks'
import {
  cursorOffset,
  insertCode,
  select,
  selectionCoordinates,
  setCursor,
  toggleEmClass,
  toggleTagMutable,
  toggleTags,
} from './selection'

const data = 'Example: <i><b>italic</b></i> and <b><u>bold<u/></b>'
const strikedData = 'Example: <i><b>it<s>alic</s></b></i><s> and <b><u>bol</u></b></s><b><u>d<u></u></u></b>'
const longData = 'Just long text to test selection position evaluation'
const empty = ''
const linkedData = '<a href="a">Example</a>: <i><b>italic</b></i> and <b><u>bold<u/></b>'
const codeData = 't1<code>data</code>t2'
const insertCodeData = 'data'
const em = '<pre>Nice <em class="red-b">cat</em></pre>'

class RecOffset {
  x = -1
  b = -1
}

type Ref = React.RefObject<HTMLDivElement>
type OnMount = (r: Ref, setData: SetStr) => RecOffset | void

const T =
  (f: OnMount, html = data) =>
  () => {
    const ref = useRef<HTMLDivElement>(null)
    const [data, setData] = useState(html)
    const [offset, setOffset] = useState<RecOffset | void>(undefined)
    useMount(() => {
      setOffset(f(ref, setData))
    })

    return (
      <Box sx={{ position: 'relative', width: 300 }}>
        <ContentEditable
          innerRef={ref}
          html={data}
          onChange={() => {}}
          tagName="p"
          style={{ outline: 'none' }}
          id="ce"
        />
        {offset && (
          <Box
            sx={{
              width: 30,
              height: 30,
              backgroundColor: 'red',
              position: 'absolute',
              top: offset?.b || 0,
              left: offset?.x || 0,
            }}
            data-cy="rec"
          />
        )}
      </Box>
    )
  }

export const SelectsRange = T((ref) => {
  const root = safe(ref.current)
  select(root, 11, 23)
  root.focus()
})

export const SetsCursor = T((ref) => {
  const root = safe(ref.current)
  setCursor(root, 90)
  root.focus()
})

export const SetsCursorFromEnd = T((ref) => {
  const root = safe(ref.current)
  setCursor(root, 95, 'backward')
  root.focus()
})

export const SetsCursorFromEndWithCharactersOffset = T((ref) => {
  const root = safe(ref.current)
  setCursor(root, 13, 'backward', 'symbol')
  root.focus()
})

export const WrapsTag = T((ref) => {
  const root = safe(ref.current)
  select(root, 11, 23)
  toggleTagMutable(root, 's')
  root.focus()
})

export const WrapsTagWithNewClass = T((ref) => {
  const root = safe(ref.current)
  select(root, 5, 8)
  toggleEmClass(root, 'blue')
  root.focus()
}, em)

export const WrapsSeveralTags = T((ref, setData) => {
  const root = safe(ref.current)
  select(root, 0, 7)
  setData(toggleTags(root, 'strong', 'a'))
  root.focus()
}, linkedData)

export const UnwrapsTag = T((ref) => {
  const root = safe(ref.current)
  select(root, 11, 23)
  toggleTagMutable(root, 's')
  root.focus()
}, strikedData)

export const FocusEmpty = T((ref) => {
  const root = safe(ref.current)
  setCursor(root, 666)
  root.focus()
}, '')

export const CalculatesOffset = T((ref) => {
  const root = safe(ref.current)
  setCursor(root, 13, 'backward', 'symbol')
  setCursor(root, cursorOffset(root), 'forward', 'symbol')
  root.focus()
})

export const CalculatesSelectionPosition2Rows = T((ref) => {
  const root = safe(ref.current)
  select(root, 23, 38)
  root.focus()
  return selectionCoordinates(root)
}, longData)

export const CalculatesSelectionPosition = T((ref) => {
  const root = safe(ref.current)
  select(root, 13, 23)
  root.focus()
  return selectionCoordinates(root)
}, longData)

export const CalculatesEmptySelectionPosition = T((ref) => {
  const root = safe(ref.current)
  root.focus()
  return selectionCoordinates(root)
}, empty)

export const IgnoresCode = T((ref) => {
  const root = safe(ref.current)
  setCursor(root, 1, 'backward', 'symbol')
  root.focus()
}, codeData)

export const InsertsCode = T((ref, setData) => {
  const root = safe(ref.current)
  select(root, 1, 4)
  setData(insertCode(root, '1', ''))
  root.focus()
}, insertCodeData)

export const InsertsCodeAtTheEnd = T((ref, setData) => {
  const root = safe(ref.current)
  setCursor(root, 0, 'backward')
  setData(insertCode(root, '1', ''))
  root.focus()
}, insertCodeData)

export default {
  title: 'Utils/Selection',
}
