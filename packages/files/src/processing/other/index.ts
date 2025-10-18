import fs from 'fs/promises'
import { FileProcessor } from '../fileProcessor.js'
import { OtherModifications } from '../types.js'

export const otherProcessor: FileProcessor<OtherModifications> = {
  async process(buffer, out) {
    await fs.writeFile(out, buffer)
  },
  stringifyModifications(modifications) {
    return ''
  },
  sanitise: (x) => x
}
