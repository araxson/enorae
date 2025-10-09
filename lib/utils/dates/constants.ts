export const DATE_FORMATS = {
  short: 'MMM d, yyyy',
  long: 'EEEE, MMMM d, yyyy',
  time: 'h:mm a',
  time24: 'HH:mm',
  datetime: 'MMM d, yyyy h:mm a',
  datetimeLong: 'EEEE, MMMM d, yyyy h:mm a',
  iso: "yyyy-MM-dd'T'HH:mm:ss",
  date: 'yyyy-MM-dd',
  monthYear: 'MMMM yyyy',
  shortMonthYear: 'MMM yyyy',
} as const

export type DateFormatKey = keyof typeof DATE_FORMATS
