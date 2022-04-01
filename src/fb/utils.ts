const v = typeof localStorage !== 'undefined' ? localStorage.getItem('_MOCK_FB') : null
// eslint-disable-next-line prefer-const
let _MOCK_FB = v === null ? true : v
export const isInProduction = process.env.NODE_ENV === 'production' || !_MOCK_FB
// export const isInProduction = false
