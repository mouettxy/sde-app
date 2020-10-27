import { User } from '@/typings/api'
import { OrderAddress, OrderInformation, OrderPrices, OrderRoute } from '@/typings/order'
import { chain, compact, isNull, join, map, size } from 'lodash'
import moment from 'moment'

export const formatPhoneNumber = (str: string) => {
  //Filter only numbers from the input
  let cleaned = ('' + str).replace(/\D/g, '')
  cleaned = cleaned.slice(1)

  //Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/)

  if (match) {
    return '+7 ' + '(' + match[1] + ') ' + match[2] + ' ' + match[3] + '-' + match[4]
  }

  return null
}

export const formatAddress = (address: OrderAddress) => {
  let phone = address.fields.phone
  if (phone) {
    phone = phone.replace(/\D/g, '')
    if (phone[0] === '7') {
      phone = '8' + phone.slice(1)
    } else {
      phone = '8' + phone
    }
  }
  const a = join(compact([address.address, address.fields.comment, phone || false]), ', ')
  const b = join(
    compact([
      address.fields.takeIn ? 'занос' : false,
      address.fields.takeOut ? 'вынос' : false,
      address.fields.buyin ? `выкуп(${address.fields.buyin})` : false,
      address.fields.buyout ? `выручка(${address.fields.buyout})` : false,
      address.fields.bundles ? `наборов ${address.fields.bundles}` : false,
    ]),
    ', ',
  )

  const c = b ? `${a} (${b})` : a
  return c
}

export const formatData = (
  client: User | string | null,
  addresses: OrderAddress[],
  info: OrderInformation | null,
  routes: OrderRoute | null,
  prices: OrderPrices | null,
) => {
  const fields = (id: number) => {
    return addresses[id].fields
  }

  const isNewUser = (user: User | string | null): user is string | null => {
    return typeof user === 'string' || isNull(user)
  }

  const from = formatAddress(addresses[0])
  const to = chain(addresses.slice(1))
    .map((e: OrderAddress) => formatAddress(e))
    .join(' ---> ')
    .value()

  moment.locale('ru')

  const modern = {
    month: moment().startOf('month').format('L'),
    date: moment().toISOString(),
    orderTime: moment().toISOString(),
    orderFromTime: moment(fields(0).datetime, 'DD.MM.YYYY HH:mm').toISOString() || '',
    orderToTime: moment(fields(size(addresses) - 1).datetime, 'DD.MM.YYYY HH:mm').toISOString() || '',
    clientId: isNewUser(client) ? client : client.id,
    addresses: map(addresses, (e) => {
      return { address: e.address, fields: e.fields, id: e.id, lat: e.lat, lon: e.lon }
    }),
    info: info,
    price: prices,
    route: routes,
    to,
    from,
  }

  return modern
}
