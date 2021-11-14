/* eslint-disable mocha/no-exclusive-tests */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />
import * as UBlocksSet from './UBlocksSet.stories'
import { got, saw, type, show, click } from '../../../../utils/testUtils'
import { num } from '../../../../utils/types'
import { _fluffyBlob } from '../../../../content/content'

const utext = (n?: num) => got('utext', n)
const ublock = (n?: num) => got('ublock', n)

describe('UBlocksSet', () => {
  it('focus moves from title to factory & factory preserves focus when adding empty blocks', () => {
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

  it('inserts block by add button', () => {
    show(UBlocksSet.OneEmptyBlock, '5rem')
    click('add-block-h').type('1')
    saw('1')
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

    type('{enter}')
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

  it.only('Separate block on paste', () => {
    show(UBlocksSet.BlocksDeletion)

    utext(1).type('{leftarrow}').paste({ pasteType: 'text/plain', pastePayload: 'r \n\n1\n\n2\n\nthird block' })
    type('3')
    saw('car')
    saw('third blockt3')
  })

  it('handles block separation with inline latex', () => {
    show(UBlocksSet.WihLatex)
    utext(1).focus()
    type(['{rightarrow}'.repeat(8)], ['{enter}'], ['!'])
    saw('!nd')
  })

  it('handles block separation between 2 latex', () => {
    show(UBlocksSet.WihLatex)
    utext(3).focus()
    type(['{rightarrow}'.repeat(8)], ['{enter}'], ['!'])
    saw('!mall')
  })

  it('preserves cursor position when tex is changed', () => {
    show(UBlocksSet.WihLatex)
    cy.get(`[data-id="666"]`).realClick()
    type(['+{enter}'], ['!'])
    saw('!small')
  })

  it('Moves up & down', () => {
    show(UBlocksSet.ArrowsNavigation)

    type('utext', '{leftarrow}'.repeat(12))
    type('{downarrow}')
    type('{downarrow}')
    type('{downarrow}')
    type('{downarrow}'.repeat(3))
    type('{downarrow}'.repeat(3))
    type('{downarrow}')
    type('{downarrow}')
    type('1')

    saw('h1ighly')

    type('{uparrow}')

    type('{uparrow}')
    type('{uparrow}'.repeat(3))
    type('{uparrow}'.repeat(3))
    type('{uparrow}')
    type('{uparrow}')
    type('2')

    saw('Kitte2ns')
  })
  // it was before inline latex separation and caused it to fail -> keep it on the bottom of spec
  it('pastes image', () => {
    show(UBlocksSet.OneEmptyBlock)
    cy.then(_fluffyBlob).then((b) => utext(1).paste({ pasteType: 'image/png', pastePayload: b }))
    saw('img-cy', 'selection-cy')
  })

  // it.only('deletes selected blocks', () => {
  //   show(UBlocksSet.BlocksDeletion)
  //   click('block-menu-h') // select image!!
  // })

  // it('Readonly', () => {
  //   show(UPageS.Readonly)
  //   cy.contains('d')

  //   utext().eq(0).should('have.attr', 'disabled')
  //   utext().eq(1).should('have.attr', 'disabled')
  // })
})
