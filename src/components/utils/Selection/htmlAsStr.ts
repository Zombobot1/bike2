import { cutData, insert } from '../../../utils/algorithms'
import { bool, num, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { dfsText } from './dfsText'

export function insertTag(
  html: str,
  tag: str,
  beforeInsertion: str,
  insertAround: str,
  attributes = '',
  body = '',
): str {
  html = html.replaceAll('&amp;', '&').replaceAll('&nbsp;', ' ')
  const start = scrollThroughTags(0, html, beforeInsertion)
  let end = insertAround ? scrollThroughTags(beforeInsertion ? start : 0, html, insertAround) : start
  if (insertAround && body) {
    html = cutData(html, start, end) // body replaces insertAround
    end = start
  }

  const newData = insert(html, start, attributes ? `<${tag} ${attributes}>` : `<${tag}>`)
  let offset = end + tag.length + 2 // + 2 for < and >
  if (attributes) offset += attributes.length + 1
  return insert(newData, offset, `${body}</${tag}>`)
}

export function removeTagBefore(html: str, tag: str, beforeRemoval: str, removeAround: str): str {
  const { nodes, start } = extractNodesAroundData(html, beforeRemoval, removeAround)
  const cut = cutData(html, start, nodes)
  return insert(cut, start, nodes.replaceAll(tagStartOrEndRe(tag), ''))
}

export function replaceClassBefore(html: str, tag: str, class_: str, beforeRemoval: str, removeAround: str): str {
  const { nodes, start } = extractNodesAroundData(html, beforeRemoval, removeAround)
  const cut = cutData(html, start, nodes)
  return insert(cut, start, nodes.replaceAll(tagStartRe(tag), `<${tag} class="${class_}">`))
}

export function removeTag(html: str, tag: str): str {
  return html.replace(tagRe(tag), '$1')
}

export function replaceTag(html: str, tag: str, replacement: str): str {
  const [tagName, ...attrs] = replacement.split(' ')
  return html.replace(tagRe(tag), `<${tagName} ${attrs.join(' ')}>$1</${tagName}>`)
}

const anyCodeRe = () => new RegExp('<code data-id="(.*?)".*?>.*?<\\/code>', 'gms')
const codeWithIdRe = (id: str) => new RegExp(`<code data-id="${id}".*?>.*?<\\/code>`, 's')

export function removeCode(html: str, id: str): str {
  return html.replace(codeWithIdRe(id), '')
}

export function hasCode(html: str): bool {
  return !!anyCodeRe().exec(html)
}

export function replaceCode(html: str, id: str, newHtml: str): str {
  return html.replace(new RegExp(codeWithIdRe(id)), `<code data-id="${id}" contenteditable="false">${newHtml}</code>`)
}

export function replaceAllCodeToHTML(html: str, map: Map<str, { html: str }>): str {
  return html.replaceAll(anyCodeRe(), (_, id) => {
    return `<code data-id="${id}" contenteditable="false">${map.get(id)?.html}</code>`
  })
}

export function replaceAllCodeToTex(html: str, map: Map<str, { tex: str }>): str {
  return html.replaceAll(anyCodeRe(), (_, id) => {
    return `<code data-id="${id}" contenteditable="false">${map.get(id)?.tex}</code>`
  })
}

export function replaceAllCodeToNothing(html: str): str {
  return html.replaceAll(anyCodeRe(), '')
}

export function codeOffset(html: str, codeId: str): num {
  const index = new RegExp(`<code data-id="${codeId}"`).exec(html)?.index
  if (index === undefined) throw new Error('Code not found')
  const htmlBeforeCode = html.slice(0, index)
  if (!htmlBeforeCode) return 1
  const textBeforeCode =
    dfsText(htmlToElement(replaceAllCodeToNothing(htmlBeforeCode))).reduce((acc, v) => acc + v.textContent, '') + 1
  return textBeforeCode.length + 1 // + 1 to move cursor behind code
}

export function containsTag(html: str, tag: str): bool {
  return Boolean(tagRe(tag).exec(html))
}

export const containsTagBefore = (html: str, tag: str, dataBefore: str, data: str) =>
  !!tagStartRe(tag).exec(extractNodesAroundData(html, dataBefore, data).nodes)

type Match = 'no-class' | 'wrong-class' | 'right-class'
export function containsTagWithClassBefore(html: str, tag: str, class_: str, dataBefore: str, data: str): Match {
  const nodes = extractNodesAroundData(html, dataBefore, data).nodes
  const containsTag = !!tagStartRe(tag).exec(nodes)
  if (!containsTag) return 'no-class'
  if (!classStartRe(tag, class_).exec(nodes)) return 'wrong-class'
  return 'right-class'
}

export function htmlToElement(html: str): HTMLElement {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return safe(template.content.firstChild) as HTMLElement
}

const tagStartOrEndRe = (tag: str) => new RegExp(`<\\/?${tag}.*?>`, 'gm')
const tagStartRe = (tag: str) => new RegExp(`<${tag}.*?>`, 'gm')
const classStartRe = (tag: str, class_: str) => new RegExp(`<${tag} class="${class_}">`, 'gm')
const tagRe = (tag: str) => new RegExp(`<${tag}.*?>(.*?)<\\/${tag}>`, 'gm')

function extractNodesAroundData(html: str, dataBefore: str, data: str): { nodes: str; start: num } {
  let startI = 0
  let endI = 0

  let seenData = ''
  for (let i = 0; i < html.length; i++) {
    if (seenData === dataBefore) {
      startI = i
      break
    }
    if (html[i] === '<') i += scrollThroughTag(i, html)
    else seenData += html[i]
  }

  seenData = ''
  for (let i = startI; i < html.length; i++) {
    if (html[i] === '<') i += scrollThroughTag(i, html)
    else seenData += html[i]
    if (seenData === data) {
      while (html[i + 1] === '<') {
        while (html[i + 1] !== '>') i++
        i++
      }
      endI = i
      break
    }
  }

  return { nodes: html.slice(startI, endI + 1), start: startI }
}

export function sliceHtml(html: str, cursorOffset: num): str {
  return html.slice(0, scrollUntil(html, cursorOffset))
}

export function cutHtml(html: str, dataToCut: str, cursorOffset: num): str {
  return cutData(html, scrollUntil(html, cursorOffset) - 1, dataToCut) // -1 because slice(0, scrollUntil(html, cursorOffset)) gives +1
}

function scrollUntil(html: str, untilI: num): num {
  if (!html) return 0
  if (!untilI) return 0

  let symbolsCount = 0
  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<') i += scrollThroughTag(i, html)
    else symbolsCount++
    if (symbolsCount === untilI) return i + 1
  }

  throw new Error('Failed to scroll')
}

export function scrollThroughTags(i: num, html: str, targetData: str): num {
  if (!targetData) return 0

  let seenData = ''
  for (; i < html.length; i++) {
    if (html[i] === '<') i += scrollThroughTag(i, html)
    else seenData += html[i]
    if (seenData === targetData) {
      if (i === 0) return 1 // edge case: scrollThroughTags(0, 'ab', 'a') -> 1
      return i + 1 // function is designed to run several times sequentially, so + 1 is here
    }
  }
  throw new Error('Failed to scroll')
}

function scrollThroughTag(i: num, html: str): num {
  if (html.slice(i, i + 5) === '<code') return scrollThroughCode(i, html)

  for (let d = 0; d < html.length; d++) {
    if (html[i + d] === '>') return d
  }

  throw new Error('Failed to scroll')
}

function scrollThroughCode(i: num, html: str): num {
  for (let d = 0; d < html.length; d++) {
    if (html.slice(i + d - 6, i + d + 1) === '</code>') return d
  }

  throw new Error('Failed to scroll')
}
