import { JSX } from '@hd-web/jsx'

const Hello = ({ kind, children }: { kind: string; children: JSX.Element }) => (
  <div>{children}</div>
)

const Bye = () => (
  <Hello kind="string">
    <div>jij</div>
  </Hello>
)
