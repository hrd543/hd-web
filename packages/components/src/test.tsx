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
    <div tabindex>jij</div>
    <canvas width={2} />
    <button style={{ 'background-color': 'coral' }}></button>
  </Hello>
)
