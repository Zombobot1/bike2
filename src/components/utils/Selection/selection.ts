import { bool, num, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { arrowNavigationSizeMultipliers } from '../../editing/UText/utextStyles'

import { dfsText } from './dfsText'
import {
  containsTagBefore,
  containsTagWithClassBefore,
  cutHtml,
  insertTag,
  removeTagBefore,
  replaceClassBefore,
} from './htmlAsStr'

export function relativeDimensions(component: str, rec?: DOMRect) {
  const px = rec?.x || 0
  const py = rec?.y || 0
  const pb = rec?.bottom || 0

  const xy = getCaretCoordinates()
  const x = xy.x - px
  const y = xy.y - py
  const b = pb - xy.b - 8 // -8 because y and b have 2px error

  const m = arrowNavigationSizeMultipliers.get(component) || 1
  const toTop = y / (16 * m)
  const toBottom = b / (16 * m)

  return { x, isTop: toTop < 1, isBottom: toBottom < 1 }
}

export function getCaretRelativeCoordinates(rec?: DOMRect) {
  const px = rec?.x || 0
  const py = rec?.y || 0

  const xy = getCaretCoordinates()
  const x = xy.x - px
  const y = xy.y - py

  return { x, y }
}

export function selectionCoordinates(relativeTo: HTMLElement): { x: num; b: num } {
  const range = safe(window.getSelection()?.getRangeAt(0))
  const { x, y } = relativeTo.getBoundingClientRect()
  const style = window.getComputedStyle(relativeTo, null).getPropertyValue('font-size')
  const fontSize = parseFloat(style)

  if (!relativeTo.innerHTML) return { x: 0, b: fontSize + 16 } // + 16 for tex editor
  if (!selectedText()) {
    const { x: rX, bottom: b } = range.getClientRects()[0]
    return { x: rX - x, b: b - y + fontSize }
  }

  const startRange = range.cloneRange()
  startRange.collapse(true)
  const endRange = range.cloneRange()
  endRange.collapse()

  const { x: startX, y: startY } = startRange.getClientRects()[0]
  if (!endRange.getClientRects()[0]) return { x: 0, b: 0 }
  const { x: endX, y: endY, bottom: endBottom } = endRange.getClientRects()[0]

  if (endY === startY) return { x: (startX + endX) / 2 - x, b: endBottom - y + fontSize }
  return { x: endX - x, b: endBottom - y + fontSize }
}

export type ToggleableTags = 's' | 'b' | 'i' | 'u' | 'code' | 'mark' | 'strong' | 'a' | 'em'
export function toggleTagMutable(block: HTMLElement, tag: ToggleableTags) {
  const selected = selectedText()
  const textBeforeSelection = getTextBeforeSelection(block)

  if (containsTagBefore(block.innerHTML, tag, textBeforeSelection, selected))
    block.innerHTML = removeTagBefore(block.innerHTML, tag, textBeforeSelection, selected)
  else block.innerHTML = insertTag(block.innerHTML, tag, textBeforeSelection, selected)

  setTimeout(() => select(block, textBeforeSelection.length, (textBeforeSelection + selected).length)) // without timeout doesn't change html
}

export function toggleEmClass(block: HTMLElement, class_: str) {
  const selected = selectedText()
  const textBeforeSelection = getTextBeforeSelection(block)
  const state = containsTagWithClassBefore(block.innerHTML, 'em', class_, textBeforeSelection, selected)

  if (state === 'right-class') block.innerHTML = removeTagBefore(block.innerHTML, 'em', textBeforeSelection, selected)
  else if (state === 'no-class')
    block.innerHTML = insertTag(block.innerHTML, 'em', textBeforeSelection, selected, `class="${class_}"`)
  else block.innerHTML = replaceClassBefore(block.innerHTML, 'em', class_, textBeforeSelection, selected)

  setTimeout(() => select(block, textBeforeSelection.length, (textBeforeSelection + selected).length)) // without timeout doesn't change html
}

export function toggleTag(block: HTMLElement, tag: ToggleableTags): str {
  const selected = selectedText()
  const textBeforeSelection = getTextBeforeSelection(block)

  if (containsTagBefore(block.innerHTML, tag, textBeforeSelection, selected))
    return removeTagBefore(block.innerHTML, tag, textBeforeSelection, selected)
  return insertTag(block.innerHTML, tag, textBeforeSelection, selected)
}

export function insertCode(block: HTMLElement, codeId: str, placeholder: str, { removeSlashOffset = -1 } = {}): str {
  const selected = selectedText()
  let textBeforeSelection = getTextBeforeSelection(block)

  let insertTo = block.innerHTML

  if (removeSlashOffset > 0 && textBeforeSelection.endsWith('/')) {
    textBeforeSelection = textBeforeSelection.slice(0, -1)
    insertTo = cutHtml(insertTo, '/', removeSlashOffset)
  }

  return insertTag(
    insertTo,
    'code',
    textBeforeSelection,
    selected,
    `data-id="${codeId}" contenteditable="false"`,
    placeholder,
  )
}

export function toggleTags(block: HTMLElement, tag: ToggleableTags, additionalTag: ToggleableTags): str {
  const selected = selectedText()
  const textBeforeSelection = getTextBeforeSelection(block)

  if (containsTagBefore(block.innerHTML, tag, textBeforeSelection, selected))
    return removeTagBefore(block.innerHTML, tag, textBeforeSelection, selected)
  if (containsTagBefore(block.innerHTML, additionalTag, textBeforeSelection, selected)) {
    const html = removeTagBefore(block.innerHTML, additionalTag, textBeforeSelection, selected)
    return insertTag(html, tag, textBeforeSelection, selected)
  }

  return insertTag(block.innerHTML, tag, textBeforeSelection, selected)
}

export function setCursor(
  node: HTMLElement,
  xOffset?: num,
  direction: ScrollDirection = 'forward',
  unit: 'pixel' | 'symbol' = 'pixel',
) {
  const range = document.createRange()

  const content = dfsText(node).filter((n) => {
    const t = n as Text
    const hasTextButNoValue = t.wholeText.length && !t.nodeValue?.length
    return !hasTextButNoValue // cypress anomaly
  })
  if (!content.length) return node.focus()

  let scrolled = 0

  const getX = () => range.getBoundingClientRect().x - node.getBoundingClientRect().x
  const needScroll = xOffset !== undefined && xOffset > 0
  let isNotEnough = () => needScroll && getX() < (xOffset as num)
  if (direction === 'backward') {
    content.reverse()
    isNotEnough = () => needScroll && getX() > (xOffset as num)
  }
  if (unit === 'symbol') isNotEnough = (o = 0) => needScroll && scrolled + o < (xOffset as num)

  scrolled += scrollStartThroughNode(safe(content.shift()), range, isNotEnough, direction)
  while (isNotEnough() && content.length) {
    scrolled += scrollStartThroughNode(safe(content.shift()), range, isNotEnough, direction)
  }
  range.collapse(true)

  window.getSelection()?.removeAllRanges()
  window.getSelection()?.addRange(range)
}

export function cursorOffsetAndSelection(node: HTMLElement): { offset: num; text: str } {
  return { offset: cursorOffset(node), text: selectedText() }
}

export function cursorOffset(node: HTMLElement): num {
  return getTextBeforeSelection(node).length
}

export function select(node: ChildNode, from: num, to: num) {
  const range = document.createRange()

  scrollUntil(node, range, from)
  const { startContainer, startOffset } = range

  scrollUntil(node, range, to, 'end')
  range.setStart(startContainer, startOffset) // setEnd breaks start container

  window.getSelection()?.removeAllRanges()
  window.getSelection()?.addRange(range)
}

export const selectedText = () => window.getSelection()?.toString().trim() || ''

export function getCaretCoordinates(fromStart = true): { x: num; y: num; b: num } {
  const selection = window.getSelection()
  if (selection && selection.rangeCount !== 0) {
    const range = selection.getRangeAt(0).cloneRange()
    range.collapse(fromStart)
    const rect = range.getClientRects()[0]
    if (rect) return { x: rect.x, y: rect.y, b: rect.bottom }
  }
  return { x: -1, y: -1, b: -1 } // it's safe
  // throw new Error('Cannot retrieve caret coordinates') // it throws too often
}

function getTextBeforeSelection(block: HTMLElement) {
  const content = dfsText(block)
  const cypressBug = content[0]?.textContent === ''
  if (!content.length || cypressBug) return ''

  const { start, offset } = startNodeAndOffset()
  const index = content.findIndex((n) => n === start)
  if (index === -1) throw new Error('Selection is not in block')

  const selectedNodeContent = safe(start.textContent || (start as Text).wholeText)
  const selectedNodeContentLength = selectedNodeContent.length

  let textBeforeSelection = content
    .slice(0, index)
    .map((n) => n?.textContent)
    .join('')

  if (selectedNodeContentLength !== offset)
    textBeforeSelection += selectedNodeContent.slice(0, -(selectedNodeContentLength - offset))
  else textBeforeSelection += selectedNodeContent

  return textBeforeSelection.replaceAll(' ', ' ') // the first space is dangerous one
}

function startNodeAndOffset(): { start: Node; offset: num } {
  const s = safe(window.getSelection())

  return !s.toString() && isSelectedBackwards()
    ? { start: safe(s.focusNode), offset: s.focusOffset }
    : { start: safe(s.anchorNode), offset: s.anchorOffset }
}

function isSelectedBackwards() {
  const selection = safe(window.getSelection())
  const position = selection.anchorNode?.compareDocumentPosition(safe(selection.focusNode))
  if ((!position && selection.anchorOffset > selection.focusOffset) || position === Node.DOCUMENT_POSITION_PRECEDING)
    return true
  return false
}

type ScrollDirection = 'forward' | 'backward'
function scrollStartThroughNode(
  text: ChildNode,
  range: Range,
  isNotEnough: (o: num) => bool,
  direction: ScrollDirection = 'forward',
) {
  if (direction === 'forward') {
    range.setStart(text, 0)
    while (isNotEnough(range.startOffset) && range.startOffset < (text.nodeValue?.length || 0))
      range.setStart(text, range.startOffset + 1)
    return range.startOffset
  }
  const maxScroll = text.nodeValue?.length || 0
  range.setStart(text, maxScroll)
  while (isNotEnough(maxScroll - range.startOffset) && range.startOffset > 0)
    range.setStart(text, range.startOffset - 1)

  return maxScroll - range.startOffset
}

function scrollEndThroughNode(text: ChildNode, range: Range, isNotEnough: (o: num) => bool) {
  range.setEnd(text, 0)
  while (isNotEnough(range.endOffset) && range.endOffset < (text.nodeValue?.length || 0))
    range.setEnd(text, range.endOffset + 1)
  return range.endOffset
}

function scrollUntil(node: ChildNode, range: Range, offset: num, rangePart: 'start' | 'end' = 'start') {
  const content = dfsText(node)
  let scrolled = 0
  const isNotEnough = (o = 0) => scrolled + o < offset

  const fn = rangePart === 'start' ? scrollStartThroughNode : scrollEndThroughNode
  scrolled += fn(safe(content.shift()), range, isNotEnough)
  while (isNotEnough() && content.length) {
    scrolled += fn(safe(content.shift()), range, isNotEnough)
  }
}
