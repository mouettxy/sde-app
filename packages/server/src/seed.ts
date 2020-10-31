import { OrderModel } from './models/orderModel'
import { UserModel } from './models/userModel'
import { ClientModel } from './models/clientModel'
import dJSON from 'dirty-json'
import { each, find, trim } from 'lodash'
import axios from 'axios'
import moment from 'moment'

moment.locale('ru')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sleep = require('util').promisify(setTimeout)

const dadataConfig = {
  baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest',
  headers: {
    common: {
      Authorization: `Token 8660205bb41fd82d6f57ae8280c8517ca964801e`,
    },
    post: {
      'Content-Type': 'application/json',
    },
  },
}

const dadata = axios.create(dadataConfig)

async function getOldData() {
  const users = (await axios.get('https://api.sde.ru.com/api/v2/user')).data
  const orders = (await axios.get('https://api.sde.ru.com/api/v2/order')).data.modern
  const clients = (await axios.get('https://api.sde.ru.com/api/v2/client')).data

  return {
    users,
    orders,
    clients,
  }
}

async function seedClients(data) {
  for (const key in data) {
    const e = data[key]

    const formatPhoneNumber = (str: string) => {
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

    if (e.customer_name && e.CLIENT) {
      const created = new ClientModel({
        id: e.CLIENT,
        password: e.password ? e.password.replace('$2a$', '$2y$') : null,
        hash: e.hash,
        name: trim(e.customer_name),
        phone: e.customer_phone,
        email: null,
        rate: parseInt(e.Input) || 0,
        food: e.customer_food === '1',
        discount: parseInt(e.discount) || 0,
        paymentType: e.payment_type,
        paymentWho: e.payment_who,
        paymentForm: e.payment_form,
        attract: e.who_attracted,
        region: e.region,
        stopDelivery: e.stop_delivery === '1',
        expressDelivery: e.priority_delivery === '1',
        alwaysIn: e.always_in === '1',
        alwaysOut: e.always_out === '1',
        free: {
          in: e.free_in === '1',
          out: e.free_out === '1',
          cash: e.free_cash === '1',
          pay: e.free_pay === '1',
          extraPoint: e.free_extra_point === '1',
        },
      })

      if (e.aliases) {
        each(dJSON.parse(e.aliases), (e) => {
          created.addresess.push(e)
        })
      } else {
        created.addresess = []
      }

      const mainAddress = find(created.addresess, { name: 'От нас / К нам' })

      if (mainAddress && !mainAddress.fields) {
        const phoneNumber = formatPhoneNumber(e.customer_phone)
        mainAddress.fields = {
          bundles: 0,
          bus: false,
          buyin: 0,
          buyout: 0,
          comment: e.customer_adress_comment || '',
          datetime: '',
          phone: phoneNumber ? phoneNumber : '',
          takeIn: created.alwaysIn,
          takeOut: created.alwaysOut,
        }
      }

      if (e.saved_orders) {
        each(dJSON.parse(e.saved_orders), (e) => {
          created.orders.push(e)
        })
      } else {
        created.orders = []
      }

      try {
        const saved = await created.save()

        console.log(`New client ${saved.name}`)
      } catch (error) {
        console.error(error.message)
      }
    }
  }
}

async function seedUsers(data) {
  for (const key in data) {
    const e = data[key]

    const created = new UserModel({
      username: e.username,
      password: e.password ? e.password.replace('$2a$', '$2y$') : null,
      phone: e.phone,
      credentials: e.full_name,
      active: e.active === '1',
      canTakeOrders: e.take_orders === '1',
      workTIme: e.work_time,
      role: e.post === 'expeditor' ? 'courier' : e.post,
      permissionsLevel: e.post_permissions,
      transport: e.transport,
      region: e.region,
      isSdeTransport: e.transport === '1',
    })

    const saved = await created.save()

    console.log(`New user ${saved.username}`)
  }
}

const suggestionsHolder = {}

async function extendAddressWithGeolocation(address) {
  const locations = [
    {
      region: 'Краснодарский',
    },
    {
      region: 'Адыгея',
    },
    {
      region: 'Крым',
    },
    {
      region: 'Севастополь',
    },
  ]

  try {
    const suggestions = await dadata.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      query: address.address,
      locations,
    })

    if (suggestions.status !== 200) {
      return false
    }

    if (suggestions.data.suggestions[0].data.geo_lat && suggestions.data.suggestions[0].data.geo_lon) {
      suggestionsHolder[address] = {
        lat: suggestions.data.suggestions[0].data.geo_lat,
        lon: suggestions.data.suggestions[0].data.geo_lon,
      }
    }

    if (suggestionsHolder[address]) {
      return suggestionsHolder[address]
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

async function extendAddressInformation(id) {
  try {
    const response = await axios.get(`https://api.sde.ru.com/api/v2/order/${id}`)

    if (response.status !== 200) {
      return false
    }

    const addresses = dJSON.parse(response.data.modern.addresses)
    const addressesMod = []
    if (!addresses[0]['id']) {
      for (const key in addresses) {
        const address = addresses[key]

        address.id = +key + 1
        address.isAlias = false
        address.completed = false
        const geo = await extendAddressWithGeolocation(address)
        if (geo) {
          address.lat = geo.lat
          address.lon = geo.lon
        }

        addressesMod.push(address)
      }

      const response_ = await axios.post(`https://api.sde.ru.com/api/v2/order/${id}/update-legacy-modern`, {
        addresses: addressesMod,
      })

      response.data.modern.addresses = addresses
      response.data.modern.info = dJSON.parse(response.data.modern.info)
      response.data.modern.price = dJSON.parse(response.data.modern.price)
      response.data.modern.route = dJSON.parse(response.data.modern.route)

      await sleep(1000)

      return response.data
    } else {
      response.data.modern.addresses = dJSON.parse(response.data.modern.addresses)
      response.data.modern.info = dJSON.parse(response.data.modern.info)
      response.data.modern.price = dJSON.parse(response.data.modern.price)
      response.data.modern.route = dJSON.parse(response.data.modern.route)
      return response.data
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

async function seedOrders(data) {
  for (const key in data) {
    const e = data[key]

    try {
      const response = await extendAddressInformation(e.id)

      if (response && response.processed && response.processed.who_carry !== 'Не назначен') {
        const expeditor = await UserModel.findOne({ username: response.processed.who_carry })

        if (expeditor) {
          const date = moment(e.date, 'DD.MM.YYYY').toISOString()
          const orderTime = moment(e.orderTime, 'HH:mm:ss').toISOString()
          const orderFromTime = moment(e.orderFromTime, 'DD.MM.YYYY HH:mm').toISOString()
          const orderToTime = moment(e.orderToTime, 'DD.MM.YYYY HH:mm').toISOString()
          const created = new OrderModel({
            id: e.id,
            month: e.month,
            status: response.processed.status,
            date,
            orderTime,
            orderFromTime,
            orderToTime,
            clientId: response.modern.client,
            addresses: response.modern.addresses,
            info: response.modern.info,
            price: response.modern.price,
            route: response.modern.route,
            courier: expeditor.username,
            courerCredentials: expeditor.credentials,
          })

          const saved = await created.save()

          console.log(`New order ${saved.id}`)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}

export async function seedDatabase() {
  const data = await getOldData()

  await seedClients(data.clients)
  await seedUsers(data.users)
  await seedOrders(data.orders)
}
