import { Ability, ForcedSubject, AbilityBuilder } from '@casl/ability'
import { AppAbility } from '@/typings/casl/AppAbility'
import { User } from '@/typings/user'

// abilities definition from the example above
type DefinePermissions = (user: User, builder: AbilityBuilder<AppAbility>) => void
type Roles = 'courier' | 'administrator' | 'logist' | 'guest'

const rolePermissions: Record<Roles, DefinePermissions> = {
  courier(user, { can, cannot }) {
    if (user.active) {
      can('read', 'CourierPage')
      can('read', 'Order')

      if (user.canTakeOrders) {
        can('take', 'Order')
      }

      if (user.permissionsLevel === 3) {
        cannot('takeWithCash', 'Order')
      } else {
        can('takeWithCash', 'Order')
      }
    } else {
      can('read', 'GuestPage')
    }
  },
  administrator(user, { can }) {
    can('read', 'all')
    can('create', 'all')
    can('update', 'all')
    can('delete', 'all')
  },
  logist(user, { can, cannot }) {
    can('read', 'LogistPage')

    can('read', 'Order')
    can('read', 'User')
    can('read', 'Client')

    can('update', 'User')
    can('update', 'Order')
    can('update', 'Client')

    can('create', 'User')
    can('create', 'Order')
    can('create', 'Client')

    can('delete', 'User')
    can('delete', 'Order')
    can('delete', 'Client')
  },
  guest(user, { can }) {
    can('read', 'GuestPage')
  },
}

export function defineAbilityFor(user: User): AppAbility {
  //@ts-ignore
  const builder = new AbilityBuilder<AppAbility>(Ability)
  if (user) {
    if (typeof rolePermissions[user.role] === 'function') {
      rolePermissions[user.role](user, builder)
    }
  } else {
    rolePermissions['guest'](user, builder)
  }

  return builder.build()
}
