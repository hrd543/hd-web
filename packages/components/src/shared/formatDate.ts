/**
 * Format a date in a short format:
 *
 * 24 Aug for example.
 */
export const formatShortDate = (date: Date) =>
  date.toLocaleDateString('en-gb', {
    day: 'numeric',
    month: 'short'
  })
