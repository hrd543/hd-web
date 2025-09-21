import { BaseProps, HdElement } from '@hd-web/jsx'

import { refAttribute } from '../constants.js'
import { flattenChildren } from '../shared/flattenChildren.js'
import { StringifyFunction } from '../types.js'
import { closeIntrinsic, openIntrinsic } from './openAndCloseTag.js'

export const stringifyIntrinsic: StringifyFunction<HdElement> = ({
  tag,
  children,
  props
}) => {
  processRef(props ?? {})

  return {
    nodes: [...(flattenChildren(children) ?? []), closeIntrinsic(tag)],
    html: openIntrinsic(tag, props ?? {})
  }
}

const processRef = (props: BaseProps) => {
  if (props['ref']) {
    props[refAttribute] = props.ref
    delete props.ref
  }
}
