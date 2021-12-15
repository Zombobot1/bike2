// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />
import * as UBlocksSet from './UBlockSet.stories'
import { got, saw, type, show, click, lost } from '../../../../utils/testUtils'
import { num } from '../../../../utils/types'
import { _fluffyBlob } from '../../../../content/content'

const utext = (n?: num) => got('utext', n)
const ublock = (n?: num) => got('ublock', n)

describe('UBlockSet', () => {
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

  it('Inserts block under active image', () => {
    show(UBlocksSet.BlocksDeletion)
    ublock(3).click().type('{enter}')
    type('1')
    saw('1')
  })

  it('Factory loses focus when adding not empty blocks | block adds new block', () => {
    show(UBlocksSet.BlocksCreation)
    utext(1).type('1')
    utext(1).should('have.focus').type('p').contains('1p')

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

  it('Separate block on paste', () => {
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

  it('moves down | moves to factory | moves up | moves to title', () => {
    show(UBlocksSet.ArrowsNavigation)

    const d = ['{downarrow}']
    const u = ['{uparrow}']
    const u2 = ['{uparrow}'.repeat(2)]
    const d2 = ['{downarrow}'.repeat(2)]

    type('utext', '{movetostart}' + '{rightarrow}'.repeat(2))
    type(d, d2, d, d2, d2, d, d, d, ['1'])
    saw('h1ighly')

    type(d)
    got('utext', 8).should('have.focus')

    type(u, ['{movetostart}' + '{rightarrow}'.repeat(8)])
    type(u, u, u, u, u2, u2, u, u, ['2'])
    saw('K2ittens')

    type(u)
    got('utext').should('have.focus')
  })

  it('deletes selected blocks', () => {
    show(UBlocksSet.BlocksDeletion, '2rem')
    click(['block-menu-h', 2], ['block-menu-h', 3]) // select image!!
    got('delete').click({ force: true })
    lost('d')
    cy.get('img').should('not.exist')
  })

  it('separates and merges text blocks', () => {
    show(UBlocksSet.BlocksDeletion)
    utext(1).type('{leftarrow}{enter}')
    saw(['t', 'strict'])
    type(['{backspace}'], ['{enter}'], ['{backspace}'])
    saw('cat')
  })

  // it was before inline latex separation and caused it to fail -> keep it on the bottom of spec
  it('pastes image', () => {
    show(UBlocksSet.OneEmptyBlock)
    cy.then(_fluffyBlob).then((b) => utext(1).paste({ pasteType: 'image/png', pastePayload: b }))
    saw('img-cy', 'selection-cy')
  })

  // it('Readonly', () => {
  //   show(UPageS.Readonly)
  //   cy.contains('d')

  //   utext().eq(0).should('have.attr', 'disabled')
  //   utext().eq(1).should('have.attr', 'disabled')
  // })
})
