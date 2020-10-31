import { Ability, ForcedSubject } from '@casl/ability'

const actions = ['read', 'update', 'create', 'delete', 'take', 'takeWithCash'] as const
const subjects = ['GuestPage', 'LogistPage', 'CourierPage', 'User', 'Client', 'Order', 'all'] as const
type AppAbilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>,
]
export type AppAbility = Ability<AppAbilities>
