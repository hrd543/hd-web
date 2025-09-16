import fs from 'fs/promises'

export const deleteBuildFolder = async (folder: string) => {
  try {
    await fs.rm(folder, { recursive: true, force: true })
  } catch {}
}
