import crypto from 'crypto'

export const createHash = (dir: string) => {
  // Only take the last 3 folders in the directory as they're most likely
  // to be different
  const tail = dir.split(/[\\/]/).slice(-3).join('/')

  return crypto.createHash('sha1').update(tail).digest('hex').slice(0, 7)
}
