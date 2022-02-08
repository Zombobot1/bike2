import dayjs from 'dayjs'

export const now = (): number => dayjs().unix()
