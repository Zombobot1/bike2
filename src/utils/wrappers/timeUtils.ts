import dayjs from 'dayjs'

export const now = (): number => dayjs().unix() // sec, but dayjs(msec)
export const nowCompact = () => dayjs(now() * 1e3).format('DD.MM.YY')
