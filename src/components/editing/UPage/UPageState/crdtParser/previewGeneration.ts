import { ChangePreview, PreviewItem, PreviewTag } from '../../../../../fb/FSSchema'
import { num, str } from '../../../../../utils/types'
import { UBlock, isStringBasedBlock, isAdvancedText, isUFormBlock, UBlocks } from '../../ublockTypes'
import { bfsUBlocks } from './UPageTree'

const MAX_SIZE = 24
const DELTA = 4 // for ...

export class _PreviewMaker {
  #maxSize: num
  #textOnTheLeft: num
  #textAround: num

  constructor(maxSize = MAX_SIZE) {
    this.#maxSize = maxSize
    this.#textOnTheLeft = maxSize - DELTA
    this.#textAround = Math.round(this.#textOnTheLeft / 2)
  }

  dotsBefore = (s: str, tag: PreviewTag): PreviewItem => {
    const data = s.length < this.#maxSize ? s : '...' + s.slice(-this.#textOnTheLeft)
    return { data, tag }
  }

  dotsAfter = (s: str, tag: PreviewTag): PreviewItem => {
    const data = s.length < this.#maxSize ? s : s.slice(0, this.#textOnTheLeft) + '...'
    return { data, tag }
  }

  dotsInside = (s: str, tag: PreviewTag): PreviewItem => {
    const data = s.length < this.#maxSize ? s : s.slice(0, this.#textAround) + '...' + s.slice(-this.#textAround)
    return { data, tag }
  }

  wrap = (data: str, tag: PreviewTag): PreviewItem => {
    return { data, tag }
  }

  bold = (data: str, additional: ChangePreview = []): ChangePreview => [{ data, tag: PreviewTag.b }, ...additional]
  br = (): PreviewItem => ({ tag: PreviewTag.br })
}

export const previewMaker = new _PreviewMaker()

function blockPreview({ type, data }: UBlock, operation: 'insert' | 'delete'): PreviewItem {
  const tag: PreviewTag = operation === 'insert' ? PreviewTag.em : PreviewTag.s

  let dataAsStr = ''
  if (isStringBasedBlock(type)) dataAsStr = data as str
  else if (isAdvancedText(type)) dataAsStr = (data as { text: str }).text
  else if (isUFormBlock(type)) JSON.stringify(data)
  if (!dataAsStr) return { data: `${operation === 'insert' ? 'added' : 'deleted'} a ${type}`, tag: PreviewTag.b }

  return previewMaker.dotsAfter(dataAsStr, tag)
}

export function getNewBlocksPreview(blocks: UBlocks): ChangePreview {
  const r = [] as ChangePreview
  const bfs = bfsUBlocks(blocks)
  bfs.forEach((b) => r.push(blockPreview(b, 'insert'), previewMaker.br()))
  if (r.length) r.pop()
  return r
}

export function getDeletedBlocksPreview(blocks: UBlocks): ChangePreview {
  const r = [] as ChangePreview
  const bfs = bfsUBlocks(blocks)
  bfs.forEach((b) => r.push(blockPreview(b, 'delete'), previewMaker.br()))
  if (r.length) r.pop()
  return r
}

const numberRe = /[\d.]+/g
const propNameRe = /"[\w\d]+":/g
const bracesRe = /[[\]{}"]/g
const commasRe = /,+/g

export function prettifyObjectPreview(preview: ChangePreview): ChangePreview {
  return preview.map((item) => {
    if (!item.data) return item

    const data = item.data
      .replaceAll(numberRe, '')
      .replaceAll(propNameRe, '')
      .replaceAll(bracesRe, '')
      .replaceAll(commasRe, ' ')

    return previewMaker.dotsInside(data, item.tag)
  })
}

export function _previewToStr(preview: ChangePreview): str {
  return preview
    .map((v) =>
      v.tag !== PreviewTag.no ? `<${PreviewTag[v.tag]}>${v.data || ''}</${PreviewTag[v.tag]}>` : v.data || '',
    )
    .join('')
}
