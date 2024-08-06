import { JSX } from '@hd-web/jsx'

const Hello = ({
  kind,
  children
}: {
  kind: string
  children: JSX.Children
}) => <div>{children}</div>

const Bye = () => (
  <Hello kind="string">
    <div style={{}} tabindex>
      <div>hi</div>
    </div>
  </Hello>
)
