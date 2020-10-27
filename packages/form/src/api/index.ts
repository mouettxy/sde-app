import endpoints, { Client, Dadata, Misc, Order } from './endpoints'
import { http, dadata, axiosInstance } from '@/plugins/axios'

const ClientAPI = new Client(http)
const DadataAPi = new Dadata(dadata)
const MiscAPI = new Misc(axiosInstance)
const OrderAPI = new Order(http)

/* -------------------------------------------------------------------------- */
/*                                 CLIENT API                                 */
/* -------------------------------------------------------------------------- */

export const getClient = async (id: number | string) => {
  return await ClientAPI.getById(id)
}

export const setAliases = async (id: number | string, payload: any) => {
  return await ClientAPI.setAliases(id, payload)
}

export const loginClient = async (id: number | string, password: string) => {
  return await ClientAPI.login(id, password)
}

export const renewToken = async (id: number | string) => {
  return await ClientAPI.token(id)
}

/* -------------------------------------------------------------------------- */
/*                                ADDRESSES API                               */
/* -------------------------------------------------------------------------- */

export const getSuggestions = async function (query: string) {
  return await DadataAPi.get(query)
}

export const getLatLon = async function (address: string) {
  return await MiscAPI.geocode(address)
}

/* -------------------------------------------------------------------------- */
/*                                  ORDER API                                 */
/* -------------------------------------------------------------------------- */

export const sendOrder = async (data: any) => {
  return await OrderAPI.save(data)
}

export const saveOrder = async (state: any, id: number | string) => {
  return await ClientAPI.setOrder(id, { address: state })
}

export const clientApi = {
  getClient,
  loginClient,
  renewToken,
  saveOrder,
  setAliases,
}

export const addressesApi = {
  getSuggestions,
  getLatLon,
}

export const ordersApi = {
  sendOrder,
}

export default {
  getClient,
  loginClient,
  renewToken,
  getSuggestions,
  saveOrder,
  sendOrder,
}
