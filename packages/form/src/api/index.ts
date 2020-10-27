import { Client, Dadata, Misc, Order } from './endpoints'
import { http, dadata, axiosInstance } from '@/plugins/axios'

const ClientAPI = new Client(http)
const DadataAPi = new Dadata(dadata)
const MiscAPI = new Misc(axiosInstance)
const OrderAPI = new Order(http)

export const userApi = {
  login: ClientAPI.login,
  ping: ClientAPI.ping,
  get: ClientAPI.getById,
  setOrder: ClientAPI.setOrder,
  setAliases: ClientAPI.setAliases,
}

export const addressesApi = {
  suggestions: DadataAPi.get,
  latLon: MiscAPI.geocode,
}

export const ordersApi = {
  send: OrderAPI.send,
}
