const defaultLocale = 'en-CA'
function convertToLongDate(isoDateString: string) {
  const newDate = new Date(isoDateString)
  if (!newDate) {
    return ''
  }
  const time = newDate.toLocaleTimeString(defaultLocale).split(' ', 2)

  const date = newDate.toLocaleDateString(defaultLocale)

  const hhmm = time[0].split(':', 2).join(':')
  const ampm = time[1]

  return `${hhmm} ${ampm} ${date}`
}

function convertDatePairs(isoDateString1: string, isoDateString2: string) {
  const newDate1 = new Date(isoDateString1)
  const newDate2 = new Date(isoDateString2)
  if (!newDate1 || !newDate2) {
    return { startDate: '', endDate: '' }
  }
  const time1 = newDate1.toLocaleTimeString(defaultLocale).split(' ', 2)

  const date1 = newDate1.toLocaleDateString(defaultLocale, { month: 'short', day: 'numeric', year: 'numeric' })

  const hh = time1[0].split(':', 1)[0]
  const ampm = time1[1]

  const time2 = newDate2.toLocaleTimeString(defaultLocale).split(' ', 2)

  const date2 = newDate2.toLocaleDateString(defaultLocale, { month: 'short', day: 'numeric', year: 'numeric' })

  const hh2 = time2[0].split(':', 1)[0]
  const ampm2 = time2[1]

  return { startDate: `${date1} at ${hh} ${ampm}`, endDate: `${date2} at ${hh2} ${ampm2}` }
}

function convertDatePairsWithMinute(isoDateString1: string, isoDateString2: string) {
  const newDate1 = new Date(isoDateString1)
  const newDate2 = new Date(isoDateString2)
  if (!newDate1 || !newDate2) {
    return { startDate: '', endDate: '' }
  }
  const time1 = newDate1.toLocaleTimeString(defaultLocale).split(' ', 2)

  const date1 = newDate1.toLocaleDateString(defaultLocale, { month: 'short', day: 'numeric', year: 'numeric' })

  const hh = time1[0].split(':', 2).join(':')
  const ampm = time1[1]

  const time2 = newDate2.toLocaleTimeString(defaultLocale).split(' ', 2)

  const date2 = newDate2.toLocaleDateString(defaultLocale, { month: 'short', day: 'numeric', year: 'numeric' })

  const hh2 = time2[0].split(':', 2).join(':')
  const ampm2 = time2[1]

  return { startDate: `${date1} at ${hh} ${ampm}`, endDate: `${date2} at ${hh2} ${ampm2}` }
}

function combineDateAndTime(dateObj, timeObj) {
  try {
    if (!dateObj.isValid() || !timeObj.isValid()) {
      throw new Error('Invalid date or time object')
    }

    return dateObj
      .hour(timeObj.hour())
      .minute(timeObj.minute())
      .second(timeObj.second())
      .millisecond(timeObj.millisecond())
  } catch (error) {
    console.error('Error combining date and time:', error)
    return null
  }
}

export { convertToLongDate, convertDatePairs, convertDatePairsWithMinute, combineDateAndTime }
