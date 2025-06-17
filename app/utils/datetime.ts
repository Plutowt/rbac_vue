import day from 'dayjs'
import utc from 'dayjs/plugin/utc'

day.extend(utc)

type MaybeDate = string | Date | number

export function toDate(datetime: MaybeDate): Date {
  if (datetime instanceof Date)
    return datetime
  else if (typeof datetime === 'number' || typeof datetime === 'string')
    return new Date(datetime)

  throw new Error(`invalid date value: ${datetime}`)
}

export function toUTCDate(datetime: MaybeDate): Date {
  return day(datetime).utcOffset(0).toDate()
}

export function toLocalDate(datetime: MaybeDate): Date {
  return day(datetime).utc(true).local().toDate()
}

export function seconds2String(v: number | undefined) {
  if (v === undefined)
    return ''

  const days = Math.floor(v / 60 / 60 / 24)
  const hours = Math.floor(v / 60 / 60 % 24)
  const minutes = Math.floor(v / 60 % 60)
  const seconds = Math.floor(v % 60)
  const t = useNuxtApp().$i18n.t
  const results: string[] = []
  if (days)
    results.push(`${days} ${t('common.dateLabel.day')}`)

  results.push(
    `${hours} ${t('common.dateLabel.hour')}`,
    `${minutes} ${t('common.dateLabel.minute')}`,
    `${seconds} ${t('common.dateLabel.second')}`,
  )
  return results.join(' ')
}
