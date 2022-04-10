import { isCypress } from '../components/utils/hooks/isCypress'

const _MOCK_FB =
  typeof localStorage !== 'undefined' ? (JSON.parse(localStorage.getItem('_MOCK_FB') || 'true') as boolean) : true
export const isInProduction = (process.env.NODE_ENV === 'production' || !_MOCK_FB) && !isCypress.isCypress

export const _getMockFB = (): boolean => JSON.parse(localStorage.getItem('_MOCK_FB') || 'true')
export const _setMockFB = (v: boolean) => localStorage.setItem('_MOCK_FB', JSON.stringify(v))
