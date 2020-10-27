import { User } from '@/store/auth'
import { OrderAddress, OrderInformation, OrderPrices, OrderRoute } from '@/typings/order'
import { chain, compact, each, isNull, isUndefined, join, last, map, reduce, size } from 'lodash'
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
  const buyin = reduce(
    addresses,
    (r, v) => {
      r += v.fields.buyout
      return r
    },
    0,
  )

  const processed = {
    комментарий_загрузки: '',
    месяц: moment().locale('ru').startOf('month').format('L'),
    дата: moment().locale('ru').format('L'),
    время_заявки: moment().locale('ru').format('LTS'),
    время_подачи: fields(0).datetime || '',
    время_выполнения: fields(size(addresses) - 1).datetime || '',
    откуда: from,
    куда: to,
    автомобиль: info?.car ? 'Требуется автомобиль' : false,
    номер_клиента: !isNewUser(client) ? client.CLIENT : client,
    кто: !isNewUser(client) ? client.customer_name : '',
    телефон_клиента: !isNewUser(client) ? client.customer_phone : '',
    тариф: !isNewUser(client) ? client.Input : '',
    форма_оплаты: !isNewUser(client) ? client.payment_form : '',
    промокод: !isNewUser(client) ? client.who_attracted : '',
    скидка: !isNewUser(client) ? client.discount : '',
    условия_оплаты: !isNewUser(client) ? client.payment_type : 'Нет отсрочки',
    кто_платит: info?.whoPays || '',
    кто_везёт: !isNewUser(client) ? (client.stop_delivery === '1' ? 'не возим' : '') : '',
    пробег: routes?.overallDistance || '',
    время_в_пути: routes?.overallTimeString || '',
    'стоимость допов': prices?.additionals || '',
    стоимость: prices?.overall || '',
    стоимость_со_скидкой: prices?.discounted || prices?.overall || '',
    выручка: buyin,
    комментарий: info?.comment || '',
  }

  const id = 'id'
  const additionals = 'additionals'

  const rawTag = (strings: any, type: any) => {
    return { strings, type }
  }

  const rawTagEval = (key: string, exp: { strings: Array<string>; type: string }) => {
    // first key is always be "otkuda" key
    const id: number | undefined = last(key) === 'a' ? 0 : Number(last(key))
    if (typeof id !== 'number') {
      return ''
    }
    const idExists = typeof addresses[id] !== 'undefined'
    exp.strings = map(compact(exp.strings), (e) => {
      return (e as any).trim()
    })
      .join('')
      .split('.')
    if (exp.type === 'id') {
      if (exp.strings[0] === 'fields') {
        if (exp.strings[1] === 'phone') {
          return !isUndefined(addresses[id])
            ? addresses[id][exp.strings[0]][exp.strings[1]]
              ? '8' + addresses[id][exp.strings[0]][exp.strings[1]].replace(/\D/g, '').slice(1)
              : ''
            : ''
        }
        // @ts-ignore
        return !isUndefined(addresses[id]) ? addresses[id][exp.strings[0]][exp.strings[1]] : ''
      } else if (exp.strings[0] === 'address') {
        return !isUndefined(addresses[id]) ? addresses[id][exp.strings[0]] : ''
      }
    } else if (exp.type === 'additionals') {
      return idExists
        ? compact([
            addresses[id].fields.takeIn ? 'Занос' : '',
            addresses[id].fields.takeOut ? 'Вынос' : '',
            addresses[id].fields.bus ? 'Встретить или отправить автобус' : '',
          ]).join('; ')
        : ''
    }
    return [key, exp]
  }

  const rawMappings = {
    date_time_otkuda: rawTag`${id} fields.datetime`,
    date_time_kuda_1: rawTag`${id} fields.datetime`,
    date_time_kuda_2: rawTag`${id} fields.datetime`,
    date_time_kuda_3: rawTag`${id} fields.datetime`,
    date_time_kuda_4: rawTag`${id} fields.datetime`,
    date_time_kuda_5: rawTag`${id} fields.datetime`,
    dop_uslugi_otkuda: rawTag`${additionals}`,
    dop_uslugi_kuda_1: rawTag`${additionals}`,
    dop_uslugi_kuda_2: rawTag`${additionals}`,
    dop_uslugi_kuda_3: rawTag`${additionals}`,
    dop_uslugi_kuda_4: rawTag`${additionals}`,
    dop_uslugi_kuda_5: rawTag`${additionals}`,
    komment_otkuda: rawTag`${id} fields.comment`,
    komment_kuda_1: rawTag`${id} fields.comment`,
    komment_kuda_2: rawTag`${id} fields.comment`,
    komment_kuda_3: rawTag`${id} fields.comment`,
    komment_kuda_4: rawTag`${id} fields.comment`,
    komment_kuda_5: rawTag`${id} fields.comment`,
    otkuda: rawTag`${id} address`,
    kuda_1: rawTag`${id} address`,
    kuda_2: rawTag`${id} address`,
    kuda_3: rawTag`${id} address`,
    kuda_4: rawTag`${id} address`,
    kuda_5: rawTag`${id} address`,
    nabor_otkuda: rawTag`${id} fields.bundles`,
    nabor_kuda_1: rawTag`${id} fields.bundles`,
    nabor_kuda_2: rawTag`${id} fields.bundles`,
    nabor_kuda_3: rawTag`${id} fields.bundles`,
    nabor_kuda_4: rawTag`${id} fields.bundles`,
    nabor_kuda_5: rawTag`${id} fields.bundles`,
    summ_pay_otkuda: rawTag`${id} fields.buyout`,
    summ_pay_kuda_1: rawTag`${id} fields.buyout`,
    summ_pay_kuda_2: rawTag`${id} fields.buyout`,
    summ_pay_kuda_3: rawTag`${id} fields.buyout`,
    summ_pay_kuda_4: rawTag`${id} fields.buyout`,
    summ_pay_kuda_5: rawTag`${id} fields.buyout`,
    tel_otkuda: rawTag`${id} fields.phone`,
    tel_kuda_1: rawTag`${id} fields.phone`,
    tel_kuda_2: rawTag`${id} fields.phone`,
    tel_kuda_3: rawTag`${id} fields.phone`,
    tel_kuda_4: rawTag`${id} fields.phone`,
    tel_kuda_5: rawTag`${id} fields.phone`,
    viruchka_otkuda: rawTag`${id} fields.buyin`,
    viruchka_kuda_1: rawTag`${id} fields.buyin`,
    viruchka_kuda_2: rawTag`${id} fields.buyin`,
    viruchka_kuda_3: rawTag`${id} fields.buyin`,
    viruchka_kuda_4: rawTag`${id} fields.buyin`,
    viruchka_kuda_5: rawTag`${id} fields.buyin`,
  }

  const rawMappingsModified: any = {}

  each(rawMappings, (e, k) => {
    rawMappingsModified[k] = rawTagEval(k, e)
  })

  const raw = {
    customer: !isNewUser(client) ? client.CLIENT : client,
    komment: info?.comment || '',
    kto_opl_dost: info?.whoPays || '',
    route_opt: '',
    srochno: info?.quick || '',
    summ_pay: buyin || '',
    car: info?.car ? 'Требуется автомобиль' : '',
    ...rawMappingsModified,
  }

  const modern = {
    month: moment().locale('ru').startOf('month').format('L'),
    date: moment().locale('ru').format('L'),
    orderTime: moment().locale('ru').format('LTS'),
    orderFromTime: fields(0).datetime || '',
    orderToTime: fields(size(addresses) - 1).datetime || '',
    addresses: map(addresses, (e) => {
      return { address: e.address, fields: e.fields, id: e.id, lat: e.lat, lon: e.lon }
    }),
    info: info,
    price: prices,
    route: routes,
    car: info?.car ? 'Требуется автомобиль' : false,
    client: !isNewUser(client) ? client.CLIENT : client,
    clientName: !isNewUser(client) ? client.customer_name : '',
    clientPhone: !isNewUser(client) ? client.customer_phone : '',
    rate: !isNewUser(client) ? client.Input : '',
    payForm: !isNewUser(client) ? client.payment_form : '',
    promo: !isNewUser(client) ? client.who_attracted : '',
    discount: !isNewUser(client) ? client.discount : '',
    payCondition: !isNewUser(client) ? client.payment_type : '',
    payWho: info?.whoPays || '',
    whoWork: !isNewUser(client) ? (client.stop_delivery === '1' ? 'не возим' : '') : '',
    mileage: routes?.overallDistance || '',
    timeInWay: routes?.overallTimeString || '',
    costAdditionals: prices?.additionals || '',
    cost: prices?.overall || '',
    costDiscount: prices?.discounted || prices?.overall || '',
    buyin: buyin,
    comment: info?.comment || '',
  }

  return { raw, processed, modern }
}
