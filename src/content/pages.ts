import { UPageData } from '../components/editing/UPage/ublockTypes'
import { _generateTestUPage } from '../components/editing/UPage/UPageState/UPageState'
import { _blocks } from './blocks'
import { _generators } from '../components/editing/UPage/UPageState/crdtParser/_fakeUPage'
import { _pagesForWs } from './ws'

const { t, p } = _generators

const catsPage: UPageData = {
  ublocks: Object.values(_blocks.pets),
}

const medium: UPageData = {
  ublocks: [
    _blocks.test.kittensHL,
    _blocks.test.kittensS,
    p('small'),
    _blocks.test.kittensH2L,
    _blocks.test.kittens2S,
    _blocks.test.kittens3S,
    _blocks.test.kittensH3L,
    _blocks.test.fatCode,
    _blocks.test.kittens4S,
  ],
}

const small: UPageData = {
  ublocks: [t('0'), t('ab'), t('2')],
}

export const _pageDTOs = {
  pets: { updates: _generateTestUPage(catsPage) },
  medium: { updates: _generateTestUPage(medium) },
  small: { updates: _generateTestUPage(small) },
}

export const _extraPages = _pagesForWs.map((p) => [p[0], { updates: _generateTestUPage(p[1]) }])
