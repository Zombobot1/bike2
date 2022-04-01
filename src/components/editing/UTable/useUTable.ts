import produce from 'immer'
import { gen } from '../../../utils/algorithms'
import { num, str, strs } from '../../../utils/types'
import { UTableData } from '../UPage/ublockTypes'

export class UTableChanger {
  constructor(public data: UTableData, public setData: (d: UTableData) => void) {}

  setCell = (i: num, j: num, data: str) => this.#chg((d) => (d[j].rows[i] = data))
  updateWidth = (j: num, width: num) => this.#chg((d) => (d[j].width = width))

  addRow = (i: num, where: 'above' | 'below' = 'below') => {
    this.#chg((d) => (d[0].width = 0))
    this.#chg((d) => {
      const delta = where === 'below' ? 1 : 0
      d.forEach((col) => col.rows.splice(i + delta, 0, ''))
    })
  }

  removeRow = (i: num) => {
    this.#chg((d) =>
      d.forEach((col) => {
        if (col.rows.length === 1) col.rows[0] = ''
        else col.rows.splice(i, 1)
      }),
    )
  }

  addColumn = (j: num, where: 'left' | 'right' = 'right') =>
    this.#chg((d) => {
      const delta = where === 'right' ? 1 : 0
      d.splice(j + delta, 0, { rows: new Array(d[0].rows.length).fill(''), width: 190 })
    })

  removeColumn = (j: num) =>
    this.#chg((d) => {
      if (d.length === 1) d[0].rows = gen(d[0].rows.length, () => '')
      else d.splice(j, 1)
    })

  #chg = (f: (d: UTableData) => void) => {
    this.data = produce(this.data, (d) => {
      f(d)
    })
    this.setData(this.data)
  }
}

export function _fakeUTableChanger(data: strs[]) {
  let table: UTableData = gen(data[0].length, () => ({ rows: [], width: -1 }))
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      table[j].rows.splice(i, 0, data[i][j])
    }
  }
  const changer = new UTableChanger(table, (d) => (table = d))
  return {
    changer,
    toStr: () => {
      const iMax = table[0].rows.length
      const jMax = table.length
      const tmpTable = gen(iMax, () => gen(jMax, () => ''))
      for (let i = 0; i < table[0].rows.length; i++) {
        for (let j = 0; j < table.length; j++) {
          tmpTable[i][j] = table[j].rows[i]
        }
      }
      return JSON.stringify(tmpTable).replaceAll('"', '')
    },
  }
}
