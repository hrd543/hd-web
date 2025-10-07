declare module '*.md' {
  export const meta: Record<string, any>
  const content: string

  export default content
}
