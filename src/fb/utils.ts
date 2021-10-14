const v = localStorage.getItem('_MOCK_FB')
// eslint-disable-next-line prefer-const
export let _MOCK_FB = v === null ? true : v
