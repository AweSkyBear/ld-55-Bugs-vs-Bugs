import { createBug } from './createBug'

export const createFrienlyBug = (props: Parameters<typeof createBug>[0]) => {
  return createBug({ ...props, fraction: 'player' })
}
