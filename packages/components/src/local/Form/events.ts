export type HdFormSuccessDetail = {
  type: 'success'
}

export type HdFormFailureDetail = {
  type: 'failure'
  message: string
}

export type HdFormDetail = HdFormFailureDetail | HdFormSuccessDetail

export const hdFormEventKey = 'hd-form-event' as const

export class HdFormEvent extends CustomEvent<HdFormDetail> {
  constructor(detail: HdFormDetail) {
    super(hdFormEventKey, { detail })
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [hdFormEventKey]: HdFormEvent
  }
}
