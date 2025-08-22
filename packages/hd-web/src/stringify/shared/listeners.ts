import type { ComponentListener } from '../types.js'

export const parseListeners = (attr: string): ComponentListener[] => {
  return attr.split('|').map((entry) => entry.split('.')) as ComponentListener[]
}

export const serialiseListeners = (listeners: ComponentListener[]): string => {
  return listeners.map((x) => x.join('.')).join('|')
}
