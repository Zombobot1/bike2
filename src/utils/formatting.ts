export const addS = (n: number) => {
  return String(n) !== '1' ? 's' : ''
}

export const fancyDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const delta = Math.round((+new Date() - +date) / 1000)

  const minute = 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7

  const deltaMins = Math.floor(delta / minute)
  const deltaHrs = Math.floor(delta / hour)
  const deltaDays = Math.floor(delta / day)

  if (delta < 30) return 'now'
  if (delta < minute) return delta + ' secs ago'
  if (delta < hour) return `${deltaMins} min${addS(deltaMins)} ago`
  if (delta < day) return `${deltaHrs} hr${addS(deltaHrs)} ago`
  if (delta < day * 2) return 'yesterday'
  if (delta < week) return `${deltaDays} hr${addS(deltaDays)} ago`
  return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export const fancyNumber = (n: number): string => {
  if (Math.floor(n / 1e3)) return `${Math.floor(n / 1e3)}.${('' + n)[1]}k`
  return String(n)
}

export const percentage = (result: number) => Math.floor(result * 100) + '%' // Result must be like 52%

export const fancyTime = (secs: number, hoursOnly = false) => {
  const now = new Date()
  now.setSeconds(now.getSeconds() + secs)
  const delta = Math.round((+now - +new Date()) / 1000)

  const minute = 60
  const hour = minute * 60

  let deltaMins = Math.floor(delta / minute)
  const deltaHrs = Math.floor(delta / hour)

  if (delta < minute) return `~${delta} sec${addS(delta)}`
  if (delta < hour) return `${deltaMins} min${addS(deltaMins)}`
  deltaMins = Math.floor((delta - deltaHrs * hour) / minute)
  if (hoursOnly) return `${deltaHrs} hr${addS(deltaHrs)}`
  return `${deltaHrs} hr${addS(deltaHrs)} ${deltaMins} min${addS(deltaMins)}`
}

const div = (num: number, denom: number) => Math.floor(num / denom)

export const fancyTimerTime = (secs_: number) => {
  const mins = div(secs_, 60)
  const secs = secs_ - mins * 60
  if (mins > 0 || secs > 5) return ''
  if (secs < 0 || mins < 0) return '0'
  return '' + secs
}
