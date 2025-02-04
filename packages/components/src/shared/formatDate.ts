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

/**
 * Format a date in a long format:
 *
 * 24 August 2024 for example.
 */
export const formatLongDate = (date: Date) =>
  date.toLocaleDateString('en-gb', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
