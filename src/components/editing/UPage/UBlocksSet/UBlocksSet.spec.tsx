// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />
import * as UBlocksSet from './UBlocksSet.stories'
import { got, saw, r, type, show } from '../../../../utils/testUtils'
import { _initFB, _insertBlocks } from '../../../../_seeding'
import { _removalBlocks } from '../../../../content/ublocks'
import { num, str } from '../../../../utils/types'

const _got = (dataCy: str, n?: num) => (n === -1 ? got(dataCy).last() : got(dataCy).eq(n || 0))
const utext = (n?: num) => _got('utext', n)
const ublock = (n?: num) => _got('ublock', n)
describe('UBlocksSet', () => {
  it('Focus moves from title to factory | Factory preserves focus when adding empty blocks', () => {
    show(UBlocksSet.BlocksCreation)
    utext().type('Title{enter}')
    type('{enter}')
    utext(2).should('have.focus')
    saw('Title')
  })

  it('Focus moves from title with content second time', () => {
    show(UBlocksSet.BlocksCreation)
    utext().type('{enter}')
    utext().type('{enter}')
    utext(1).should('have.focus')
  })

  it('Focus moves through empty block', () => {
    show(UBlocksSet.BlocksDeletion)
    utext(2).type('{uparrow}')
    type('1')
    saw('cat1')

    type('{downarrow}')
    type('{downarrow}')
    type('2')
    saw('2d')
  })

  it('Factory loses focus on another block click', () => {
    show(UBlocksSet.BlocksCreation)
    utext().type('{enter}')
    type('{enter}')
    utext(1).click().should('be.focused')
  })

  it('Inserts block under image', () => {
    show(UBlocksSet.BlocksDeletion)
    ublock(3).click().type('{enter}')
    type('1')
    saw('1')
  })

  it('Factory loses focus when adding not empty blocks | block adds new block', () => {
    show(UBlocksSet.BlocksCreation)
    utext(1).type('/')
    utext(1).should('have.focus').type('p').contains('/p')

    utext(1).type('{enter}')
    utext(2).should('have.focus')
  })

  it('Factory loses focus on backspace | focus moves on block deletion', () => {
    show(UBlocksSet.BlocksDeletion)

    utext(-1).type('{Backspace}')

    utext(3).should('have.focus').type('{Backspace}{Backspace}')
    utext(2).should('have.focus').type('{Backspace}')
  })

  it('Separate block on enter', () => {
    show(UBlocksSet.BlocksDeletion)

    utext(1).type('{leftarrow}{enter}')
    type('1')
    saw('1t')
  })

  it('Separate block on paste', () => {
    show(UBlocksSet.BlocksDeletion)

    utext(1).type('{leftarrow}').paste({ pasteType: 'text/plain', pastePayload: 'r \n\n1\n\n2\n\nthird block' })
    type('3')
    saw('car')
    saw('third blockt3')
  })

  it('Moves up & down', () => {
    show(UBlocksSet.ArrowsNavigation)

    utext().type(r('{leftarrow}', 12))

    type('{downarrow}')
    type('{downarrow}')
    type('{downarrow}')
    type('{downarrow}', 3)
    type('{downarrow}', 3)
    type('{downarrow}')
    type('{downarrow}')
    type('1')

    saw('h1ighly')

    type('{uparrow}')

    type('{uparrow}')
    type('{uparrow}', 3)
    type('{uparrow}', 3)
    type('{uparrow}')
    type('{uparrow}')
    type('2')

    saw('Kitte2ns')
  })

  // it('Readonly', () => {
  //   show(UPageS.Readonly)
  //   cy.contains('d')

  //   utext().eq(0).should('have.attr', 'disabled')
  //   utext().eq(1).should('have.attr', 'disabled')
  // })
})
