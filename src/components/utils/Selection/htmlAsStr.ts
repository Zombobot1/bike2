import { cutData, insert } from '../../../utils/algorithms'
import { bool, num, str } from '../../../utils/types'

export function insertTag(html: str, tag: str, beforeInsertion: str, insertAround: str): str {
  const start = scrollThroughTags(0, html, beforeInsertion)
  const end = scrollThroughTags(start ? start + 1 : 0, html, insertAround)
  const newData = insert(html, start ? start + 1 : 0, `<${tag}>`)
  return insert(newData, end + tag.length + 2 + 1, `</${tag}>`) // + 2 for < and >
}

export function removeTagBefore(html: str, tag: str, beforeRemoval: str, removeAround: str): str {
  const { nodes, start } = extractNodesAroundData(html, beforeRemoval, removeAround)
  const cut = cutData(html, start, nodes)
  return insert(cut, start, nodes.replaceAll(tagStartOrEndRe(tag), ''))
}

export function removeTag(html: str, tag: str): str {
  return html.replace(tagRe(tag), '$1')
}

export function replaceTag(html: str, tag: str, replacement: str): str {
  const [tagName, ...attrs] = replacement.split(' ')
  return html.replace(tagRe(tag), `<${tagName} ${attrs.join(' ')}>$1</${tagName}>`)
}

export function containsTag(html: str, tag: str): bool {
  return Boolean(tagRe(tag).exec(html))
}

export const containsTagBefore = (html: str, tag: str, dataBefore: str, data: str) =>
  !!tagStartRe(tag).exec(extractNodesAroundData(html, dataBefore, data).nodes)

const tagStartOrEndRe = (tag: str) => new RegExp(`<\\/?${tag}.*?>`, 'gm')
const tagStartRe = (tag: str) => new RegExp(`<${tag}.*?>`, 'gm')
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

function scrollThroughTags(i: num, html: str, targetData: str): num {
  if (!targetData) return 0

  let seenData = ''
  for (; i < html.length; i++) {
    if (html[i] === '<') i += scrollThroughTag(i, html)
    else seenData += html[i]
    if (seenData === targetData) return i
  }

  throw new Error('Failed to scroll')
}

function scrollThroughTag(i: num, html: str): num {
  for (let d = 0; d < html.length; d++) {
    if (html[i + d] === '>') return d
  }

  throw new Error('Failed to scroll')
}
