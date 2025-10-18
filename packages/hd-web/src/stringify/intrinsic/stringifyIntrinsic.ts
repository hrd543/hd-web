import { BaseProps, HdElement } from '@hd-web/jsx'

import { refAttribute } from '../constants.js'
import { flattenChildren } from '../shared/flattenChildren.js'
import { StringifyFunction } from '../types.js'
import { closeIntrinsic, openIntrinsic } from './openAndCloseTag.js'

export const stringifyIntrinsic: StringifyFunction<HdElement> = async ({
  tag,
  children,
  props
}) => {
  processRef(props ?? {})

  return {
    nodes: flattenChildren([(await children) ?? null, closeIntrinsic(tag)]),
    html: openIntrinsic(tag, props ?? {})
  }
}

const processRef = (props: BaseProps) => {
  if (props['ref']) {
    props[refAttribute] = props.ref
    delete props.ref
  }
}
