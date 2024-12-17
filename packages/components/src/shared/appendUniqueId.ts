/**
 * Given an id for a specific part of a component, generate a new,
 * unique id using the unique id number for the whole component.
 */
export const appendUniqueId = (id: string, uid: number) => `${id}-${uid}`
