import { assert, describe, expect, it } from 'vitest'
import { getStrChanges, applyStrChanges, _strChanger } from './getStrChange'

describe('getStrChange', () => {
  it('basic insertion', () => {
    const old = 'insert in me'
    const new_ = 'insert 123 in 4 me'
    const changer = _strChanger(old)
    applyStrChanges(changer, getStrChanges(old, new_))
    assert.equal(changer.toJSON(), new_)
  })

  it('basic deletion', () => {
    const old = 'delete from me'
    const new_ = 'dete from'
    const changer = _strChanger(old)
    applyStrChanges(changer, getStrChanges(old, new_))
    assert.equal(changer.toJSON(), new_)
  })

  it('basic change', () => {
    const old = 'f2'
    const new_ = 'f3'
    const changer = _strChanger(old)
    applyStrChanges(changer, getStrChanges(old, new_))
    assert.equal(changer.toJSON(), new_)
  })

  it('deletion & insertion', () => {
    const old = 'I want to have 1 nice cat'
    const new_ = 'No I will have 2 nice cats'
    const changer = _strChanger(old)
    applyStrChanges(changer, getStrChanges(old, new_))
    assert.equal(changer.toJSON(), new_)
  })

  it('provides preview', () => {
    const old = 'I have 1 cat'
    const new_ = 'We have 2 cats'
    assert.equal(getStrChanges(old, new_).preview, '<s>I</s><em>We</em> have <s>1</s><em>2</em> cat<em>s</em>')
  })

  it('reduces long preview: change in the beginning', () => {
    const old = 'text______________'
    const new_ = '1______________2text______________'
    assert.equal(getStrChanges(old, new_).preview, '<em>1___...___2</em>text____...')
  })

  it('reduces long preview: change at the end', () => {
    const old = '______________text1______________2'
    const new_ = '______________text'
    assert.equal(getStrChanges(old, new_).preview, '...____text<s>1___...___2</s>')
  })

  it('reduces long preview: change in the middle', () => {
    const old = '1______________2text3______________4'
    const new_ = '1______________2te5______________6xt3______________4'
    assert.equal(getStrChanges(old, new_).preview, '..._____2te<em>5___...___6</em>xt3_____...')
  })

  it('calculates preview: several deletions', () => {
    const old = '1   2   3   4   5   6   7   8'
    const cur = '1   3   5   a   7   b   8'
    assert.equal(
      getStrChanges(old, cur).preview,
      '1   <s>2   </s>3   <s>4   </s>5   <s>6</s><em>a</em>   7   <em>b   </em>8',
    )
  })

  it('reduces long preview: several changes', () => {
    const old = '___1____________________2te__________xt3_________________4___'
    const new_ = '___1_________5--------------6__________2te__________xt3_______7--------------8_________4___'
    assert.equal(
      getStrChanges(old, new_).preview,
      '...________<s>_</s><em>5---...---6</em>____...____<s>_</s><em>7---...---8</em>________...',
    )
  })

  it('creates new', () => {
    const new_ = 'new str'
    // cannot pass undefined
    const changer = _strChanger('')
    applyStrChanges(changer, getStrChanges('', new_))
    assert.equal(changer.toJSON(), new_)
  })
})
