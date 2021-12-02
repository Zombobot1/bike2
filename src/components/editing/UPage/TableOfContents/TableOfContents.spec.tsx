/* eslint-disable mocha/no-exclusive-tests */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />
import { JSObject, num } from '../../../../utils/types'
import { _treefy } from './blocksInfoToTree'
import { UBlockTypes } from '../../types'
import { TOCItems, TOCItems_, TOCItem_ } from './types'
import { safe } from '../../../../utils/utils'

const id = ''
const data = ''

type ItemProjection = { depth: num; children?: ItemProjection[] }
const typesToRawTocItems = (types: UBlockTypes): TOCItems => types.map((type, i) => ({ i, data, id, type }))
function tocItemHierarchy(item: TOCItem_, depth = 0): ItemProjection {
  if (!item?.children) return { depth }
  return { depth, children: safe(item.children).map((c) => tocItemHierarchy(c, depth + 1)) }
}
const tocItemsHierarchy = (items: TOCItems_): ItemProjection[] => items.map((i) => tocItemHierarchy(i))
const toStr = (o: JSObject) => JSON.stringify(o, null, 2)

describe('TableOfContents', () => {
  it('builds 123 tree', () => {
    const data = typesToRawTocItems(['heading-1', 'heading-2', 'heading-3'])

    const actual = tocItemsHierarchy(_treefy(data))
    expect(toStr(actual)).eqls(
      toStr([
        {
          depth: 0,
          children: [
            {
              depth: 1,
              children: [{ depth: 2 }],
            },
          ],
        },
      ]),
    )
  })

  it('builds 11 tree', () => {
    const data = typesToRawTocItems(['heading-1', 'heading-1'])

    const actual = tocItemsHierarchy(_treefy(data))
    expect(toStr(actual)).eqls(
      toStr([
        {
          depth: 0,
        },
        {
          depth: 0,
        },
      ]),
    )
  })

  it('builds 1212 tree', () => {
    const data = typesToRawTocItems(['heading-1', 'heading-2', 'heading-1', 'heading-2'])

    const actual = tocItemsHierarchy(_treefy(data))
    expect(toStr(actual)).eqls(
      toStr([
        {
          depth: 0,
          children: [
            {
              depth: 1,
            },
          ],
        },
        {
          depth: 0,
          children: [
            {
              depth: 1,
            },
          ],
        },
      ]),
    )
  })

  it('builds 12321 tree', () => {
    const data = typesToRawTocItems(['heading-1', 'heading-2', 'heading-3', 'heading-2', 'heading-1'])

    const actual = tocItemsHierarchy(_treefy(data))
    expect(toStr(actual)).eqls(
      toStr([
        {
          depth: 0,
          children: [
            {
              depth: 1,
              children: [{ depth: 2 }],
            },
            {
              depth: 1,
            },
          ],
        },
        {
          depth: 0,
        },
      ]),
    )
  })

  it('builds tree', () => {
    const data = typesToRawTocItems([
      'heading-1',
      'heading-2',
      'heading-3',
      'heading-2',
      'heading-2',
      'heading-3',
      'heading-1',
      'heading-3',
      'heading-1',
    ])

    const actual = tocItemsHierarchy(_treefy(data))
    expect(toStr(actual)).eqls(
      toStr([
        {
          depth: 0,
          children: [
            {
              depth: 1,
              children: [{ depth: 2 }],
            },
            {
              depth: 1,
            },
            {
              depth: 1,
              children: [{ depth: 2 }],
            },
          ],
        },
        {
          depth: 0,
          children: [{ depth: 1 }],
        },
        {
          depth: 0,
        },
      ]),
    )
  })
})
