// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />
import * as UBlocksSet from './UBlockSet.stories'
import { got, saw, type, show, click, lost } from '../../../../utils/testUtils'
import { num } from '../../../../utils/types'
import { _fluffyBlob } from '../../../../content/blocks'

const utext = (n?: num) => got('utext', n)
const factory = () => got('ublock-f')
const title = () => got('upage-title')
const ublock = (n?: num) => got('ublock', n)

describe('UBlockSet', () => {
  it('focuses if title is empty | focus moves from title to factory & factory preserves focus when adding empty blocks', () => {
    show(UBlocksSet.BlocksCreation)
    type('Title{enter}')
    type('{enter}')
    factory().should('have.focus')
    saw('Title')
  })

  it('focus moves from title with click', () => {
    show(UBlocksSet.BlocksCreation)
    title().should('have.focus')
    type('{enter}')
    title().click().type('{enter}')
    factory().should('have.focus')
  })

  it('Focus moves through empty block', () => {
    show(UBlocksSet.BlocksDeletion)
    utext(1).type('{uparrow}')
    type('1')
    saw('cat1')

    type('{downarrow}')
    type('{downarrow}')
    type('2')
    saw('2d')
  })

  it('factory loses focus on another block click', () => {
    show(UBlocksSet.BlocksCreation)
    type('{enter}')
    type('{enter}')
    utext().click().should('be.focused')
  })

  it('inserts block by add button', () => {
    show(UBlocksSet.OneEmptyBlock, '5rem')
    click('add-block-h').type('1')
    saw('1')
  })

  it('inserts block under active image', () => {
    show(UBlocksSet.BlocksDeletion)
    ublock(3).click().type('{enter}')
    type('1')
    saw('1')
  })

  it('factory loses focus when adding not empty blocks | block adds new block', () => {
    show(UBlocksSet.BlocksCreation)
    factory().type('1')
    utext().should('have.focus').type('p').contains('1p')

    type('{enter}')
    utext(1).should('have.focus')
  })

  it('factory loses focus on backspace | focus moves on block deletion', () => {
    show(UBlocksSet.BlocksDeletion)

    factory().type('{Backspace}')

    utext(2).should('have.focus').type('{Backspace}{Backspace}')
    utext(1).should('have.focus').type('{Backspace}')
  })

  it('Separate block on enter', () => {
    show(UBlocksSet.BlocksDeletion)

    utext().type('{leftarrow}{enter}')
    type('1')
    saw('1t')
  })

  it('Separate block on paste', () => {
    show(UBlocksSet.BlocksDeletion)

    utext().type('{leftarrow}').paste({ pasteType: 'text/plain', pastePayload: 'r \n\n1\n\n2\n\nthird block' })
    saw('car')
    cy.get('body').trigger('keydown', { key: 'Enter' })
    type('3')
    saw('third blockt3')
  })

  it('handles block separation with inline latex', () => {
    show(UBlocksSet.WihLatex)
    utext().focus()
    type(['{rightarrow}'.repeat(8)], ['{enter}'], ['!'])
    saw('!nd')
  })

  it('handles block separation between 2 latex | handles merge back', () => {
    show(UBlocksSet.WihLatex)
    utext(1).focus()
    type(['{rightarrow}'.repeat(8)], ['{enter}'], ['1'])
    saw('1mall')

    type(['{leftarrow}{backspace}'], ['2'])
    saw('21mall')
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

    type('upage-title', '{downarrow}')
    type(['{rightarrow}'.repeat(4)], d2, d, d2, d2, d, d, d, ['1'])
    saw('are1')

    type(d)
    factory().should('have.focus')

    type(u, ['{movetostart}' + '{rightarrow}'.repeat(8)])
    type(u, u, u, u2, u2, u, u2, ['2'])
    saw('Ki2ttens')

    type(u)
    title().should('have.focus')
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
    utext().type('{leftarrow}{enter}')
    saw(['t', 'strict'])
    type(['{backspace}'], ['{enter}'], ['{backspace}'])
    saw(['cat', 'strict'])
  })

  it('focuses autocomplete when / is typed in factory', () => {
    show(UBlocksSet.BlocksCreation)
    factory().type('/')
    got('long-menu-search').should('have.focus')
  })

  // it was before inline latex separation and caused it to fail -> keep it on the bottom of spec
  it('pastes image', () => {
    show(UBlocksSet.OneEmptyBlock)
    cy.then(_fluffyBlob).then((b) => utext().paste({ pasteType: 'image/png', pastePayload: b }))
    saw('img-cy')
    cy.get('.selected').should('exist')
  })

  // it('Readonly', () => {
  //   show(UPageS.Readonly)
  //   cy.contains('d')

  //   utext().eq(0).should('have.attr', 'disabled')
  //   utext().eq(1).should('have.attr', 'disabled')
  // })
})
