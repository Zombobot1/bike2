import { useEffect, useState } from 'react'
import { sum } from '../../../../../utils/algorithms'
import { num, str } from '../../../../../utils/types'
import { isUFormBlock, isUListBlock, UBlock, UBlocks, UFormData, UGridData, UTableData } from '../../ublockTypes'
import { bfsUBlocks } from '../../UPageState/crdtParser/UPageTree'
import { UBlocksSet } from '../UBlockSet'

// letters in row = 100
// 5 rows - 140px, 1 page - 1000px, 1 row - 30 px
// 1 page - 40 rows (140 * 8 = 1200) - 4000 letters
// img ~ 300px ~ 10 rows
// file ~ 50 px ~ 1.5row
// code ~ text * 5 (it's 5 times more sparse)

function getLettersNumber(ublock: UBlock): num {
  const { type } = ublock

  if (type === 'grid') {
    const data = ublock.data as UGridData
    const lengths = data.map((col) => col.ublocks.map((b) => getLettersNumber(b))).flat()
    return sum(lengths)
  } else if (type === 'exercise') {
    const data = ublock.data as UFormData
    const lengths = data.ublocks.map((b) => getLettersNumber(b))
    return sum(lengths)
  } else if (isUListBlock(type)) {
    const lengths = bfsUBlocks([ublock])
      .slice(1) // 0th block is list itself -> causes endless loop
      .map((b) => getLettersNumber(b))
    return sum(lengths)
  }

  if (type === 'text' || type === 'quote') return (ublock.data as str).length
  if (type === 'heading-1') return 250
  if (type === 'heading-2') return 200
  if (type === 'heading-3') return 150
  if (type === 'callout') return (ublock.data as { text: str }).text.length
  if (type === 'code') return (ublock.data as { text: str }).text.length * 5
  if (type === 'image' || type === 'video') return 1e3
  if (type === 'file' || type === 'audio') return 200
  if (type === 'block-equation') return 300
  if (type === 'table') return (ublock.data as UTableData)[0].rows.length * 100
  if (type === 'page') return 50
  if (isUFormBlock(type)) return 700

  return 0
}

// First render optimization:
// 400ms before, 150 after conditional rendering of utext options & autocomplete & 40ms after windowing
class UBlocksWindow {
  #i = 0
  #iteration = 0 // when done = 0

  get iteration() {
    return this.#iteration
  }

  getNextNLetters = (ublocks: UBlocks, n = 500): UBlocks => {
    let acc = 0

    while (this.#i < ublocks.length) {
      acc += getLettersNumber(ublocks[this.#i++])
      if (acc > n) break
    }

    if (this.#i >= ublocks.length - 1) this.#iteration = 0
    else this.#iteration++

    return ublocks.slice(0, this.#i + 1)
  }
}

export function WindowedBlockSet(ps: UBlocksSet) {
  const [window] = useState(() => new UBlocksWindow())
  const [blocks, setBlocks] = useState(() => window.getNextNLetters(ps.blocks))

  useEffect(() => {
    if (window.iteration) setTimeout(() => setBlocks(window.getNextNLetters(ps.blocks)))
  }, [window.iteration])
  const bl = window.iteration ? blocks : ps.blocks

  return <UBlocksSet {...ps} blocks={bl} />
}
