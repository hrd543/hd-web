import assert from 'assert'
import { HdFileInfoByType, HdFileType } from './types.js'
import { HdFileInfo } from '../shared/types.js'
import { getFileType } from './getFileType.js'

export const initialiseFiles = () => {
  globalThis._hdFiles = {
    image: new Map()
  }
}

export const resetFiles = () => {
  globalThis._hdFiles = undefined
}

export const isDevMode = () => globalThis._hdFiles === undefined

const areModificationsEqual = <T>(a: T, b: T) => {
  try {
    assert.deepEqual(a, b)

    return true
  } catch {
    return false
  }
}

// We only want to store references to files which will actually need to be created.
// If I reference the same file twice with identical options, only need one copy.
const shouldRegisterFile = <T>(
  existing: HdFileInfo<T>[],
  toAdd: HdFileInfo<T>
) => {
  return !existing.some((file) => {
    if (toAdd.modifications && file.modifications) {
      return areModificationsEqual(toAdd.modifications, file.modifications)
    }

    return !toAdd.modifications && !file.modifications
  })
}

/**
 * Register a file to be copied over.
 */
export const registerFile = <T extends HdFileType>(
  file: HdFileInfo<HdFileInfoByType[T]>
) => {
  const type = getFileType(file.src) as T
  const files = globalThis._hdFiles?.[type]
  const existing = files?.get(file.src)

  if (existing) {
    if (shouldRegisterFile(existing, file)) {
      existing.push(file)
    }
  } else {
    files?.set(file.src, [file])
  }
}

type HdFileInfoWithType = HdFileInfo<HdFileInfoByType[HdFileType]> & {
  type: HdFileType
}

export const getFiles = () => {
  if (!globalThis._hdFiles) {
    return []
  }

  return Object.entries(globalThis._hdFiles).reduce((all, [type, files]) => {
    all.push(
      ...files
        .values()
        .toArray()
        .flat()
        .map((x) => ({ ...x, type }) as HdFileInfoWithType)
    )

    return all
  }, [] as HdFileInfoWithType[])
}
