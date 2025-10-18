import crypto from 'crypto'

export const hashBuffer = (buffer: Buffer) => {
  const hash = crypto.createHash('md5')
  const hashed = hash.update(buffer)

  return hashed.digest('hex').slice(0, 7)
}
