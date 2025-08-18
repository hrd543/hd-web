import { HdNode } from '@hd-web/jsx/jsx-runtime'

export const createMeta = (
  title: string,
  description: string | undefined,
  head: HdNode,
  files: HdNode
): HdNode => {
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {head}
      {files}
    </>
  )
}
