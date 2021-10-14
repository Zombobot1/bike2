import { insert, reverse } from '../../../utils/algorithms'
import { bool, fn, num, str, voidP } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { containsTagBefore, insertTag, removeTagBefore } from './htmlAsStr'

export function selectionCoordinates(relativeTo: HTMLElement): { x: num; b: num } {
  const range = safe(window.getSelection()?.getRangeAt(0))

  const startRange = range.cloneRange()
  startRange.collapse(true)
  const endRange = range.cloneRange()
  endRange.collapse()

  const { x: startX, y: startY } = startRange.getClientRects()[0]
  const { x: endX, y: endY, bottom: endBottom } = endRange.getClientRects()[0]

  const { x, y } = relativeTo.getBoundingClientRect()

  const style = window.getComputedStyle(relativeTo, null).getPropertyValue('font-size')
  const fontSize = parseFloat(style)

  if (endY === startY) return { x: (startX + endX) / 2 - x, b: endBottom - y + fontSize }
  return { x: endX - x, b: endBottom - y + fontSize }
}

type Tags = 's' | 'b' | 'i' | 'u' | 'code' | 'span' | 'a'
export function toggleTagMutable(block: HTMLElement, tag: Tags) {
  const selected = selectedText()
  const textBeforeSelection = getTextBeforeSelection(block)

  if (containsTagBefore(block.innerHTML, tag, textBeforeSelection, selected))
    block.innerHTML = removeTagBefore(block.innerHTML, tag, textBeforeSelection, selected)
  else block.innerHTML = insertTag(block.innerHTML, tag, textBeforeSelection, selected)

  setTimeout(() => select(block, textBeforeSelection.length, (textBeforeSelection + selected).length)) // without timeout doesn't change html
}

export function toggleTag(block: HTMLElement, tag: Tags): str {
  const selected = selectedText()
  const textBeforeSelection = getTextBeforeSelection(block)

  if (containsTagBefore(block.innerHTML, tag, textBeforeSelection, selected))
    return removeTagBefore(block.innerHTML, tag, textBeforeSelection, selected)
  return insertTag(block.innerHTML, tag, textBeforeSelection, selected)
}

export function toggleTags(block: HTMLElement, tag: Tags, additionalTag: Tags): str {
  const selected = selectedText()
  const textBeforeSelection = getTextBeforeSelection(block)
  console.log('after del', { h: block.innerHTML, additionalTag, textBeforeSelection, selected })
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
  const needScroll = Boolean(xOffset !== undefined)
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

function getTextBeforeSelection(block: HTMLElement) {
  const { start, offset } = startNodeAndOffset()
  const content = dfsText(block)
  const index = content.findIndex((n) => n === start)
  if (index === -1) throw new Error('Selection is not in block')

  const selectedNodeContent = safe(start.textContent)
  const selectedNodeContentLength = selectedNodeContent.length

  let textBeforeSelection = content
    .slice(0, index)
    .map((n) => n?.textContent)
    .join('')

  if (selectedNodeContentLength !== offset)
    textBeforeSelection += selectedNodeContent.slice(0, -(selectedNodeContentLength - offset))
  else textBeforeSelection += selectedNodeContent

  return textBeforeSelection
}

function startNodeAndOffset(): { start: Node; offset: num } {
  const { focusNode, focusOffset, anchorNode, anchorOffset } = safe(window.getSelection())

  return isSelectedBackwards()
    ? { start: safe(focusNode), offset: focusOffset }
    : { start: safe(anchorNode), offset: anchorOffset }
}

function isSelectedBackwards() {
  const selection = safe(window.getSelection())
  const position = selection.anchorNode?.compareDocumentPosition(safe(selection.focusNode))
  if ((!position && selection.anchorOffset > selection.focusOffset) || position === Node.DOCUMENT_POSITION_PRECEDING)
    return true
  return false
}

type ScrollDirection = 'forward' | 'backward'
function dfsText(node: ChildNode) {
  function dfs(node: ChildNode) {
    const r = [node]
    for (const child of node.childNodes) r.push(...dfs(child))
    return r
  }
  return dfs(node).filter((n) => n.nodeType === 3)
}

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
