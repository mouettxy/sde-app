import endpoints from './endpoints'
import { http, dadata } from '@/plugins/axios'
import axios from 'axios'

export const publicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcdWeIjoERPmtGIj8qqeyKtq8a
AuV85C/O6YQ3tO5IP5gRfy3eVPz71Vxv01uuczgXu57/eEoyvc/pbRdHId8jlXzZ
0EtmXpNM5B0cGU2yofwaPrKbEmYl4Krl2iUI+RDSMwULIysyJ6Cf2jh+ClKtxNmU
bHzvjazHbvkgi5EteQIDAQAB
-----END PUBLIC KEY-----`

export const getClient = async (id: number | string) => {
  if (id) {
    return await http.get(endpoints.client(id).get)
  } else {
    return { data: false, status: 500 }
  }
}

export const getAliases = async (id: number) => {
  return await http.get(endpoints.client(id).aliases)
}

export const setAliases = async (id: number | string, payload: any) => {
  return await http.post(endpoints.client(id).aliases, payload)
}

export const getAddresses = async (id: number) => {
  return await http.get(endpoints.client(id).addresses)
}

export const loginClient = async (id: number | string, password: string) => {
  return await http.post(endpoints.client().login, { id, password })
}

export const renewToken = async (id: number | string) => {
  return await http.get(endpoints.client(id).renewToken)
}

/* -------------------------------------------------------------------------- */
/*                                ADDRESSES API                               */
/* -------------------------------------------------------------------------- */

export const getSuggestions = async function(query: string) {
  const locations = [
    {
      region: 'Краснодарский'
    },
    {
      region: 'Адыгея'
    },
    {
      region: 'Крым'
    },
    {
      region: 'Севастополь'
    },
    {
      region: 'Санкт-Петербург'
    }
  ]
  const response = await dadata.post(endpoints.addresses.suggestions, {
    query,
    locations
  })

  if (response.status === 200) {
    return response.data.suggestions
  } else {
    return false
  }
}

export const getLatLon = async function(address: string) {
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: address,
      key: 'AIzaSyCfgtxr_hEtON5EuNEoQA0vpJOSdXs-lJU'
    }
  })

  const coordinates = response.data['results'][0]['geometry']['location']

  if (!(response.status === 200) || !coordinates) {
    return false
  }

  return {
    lat: coordinates.lat,
    lon: coordinates.lng
  }
}

/* -------------------------------------------------------------------------- */
/*                                  ORDER API                                 */
/* -------------------------------------------------------------------------- */

export const sendOrder = async (raw: any, processed: any, modern: any) => {
  try {
    const response = await http.post(endpoints.orders.send, { raw, processed, modern })
    if (response.status !== 200) {
      return false
    }

    return response.data
  } catch (e) {
    return false
  }
}

export const saveOrder = async (state: any, id: number | string) => {
  try {
    const response = await http.post(endpoints.client(id).saveOrder, { state })

    if (response.status !== 200) {
      return false
    }

    return response.data
  } catch (e) {
    return false
  }
}

export const clientApi = {
  getClient,
  getAddresses,
  getAliases,
  loginClient,
  renewToken,
  saveOrder,
  setAliases
}

export const addressesApi = {
  getSuggestions,
  getLatLon
}

export const ordersApi = {
  sendOrder
}

export default {
  getClient,
  getAddresses,
  loginClient,
  renewToken,
  getSuggestions,
  saveOrder,
  sendOrder
}
