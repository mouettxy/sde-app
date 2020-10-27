import { Client, Dadata, Misc, Order } from './endpoints'
import { http, dadata, axiosInstance } from '@/plugins/axios'

const ClientAPI = new Client(http)
const DadataAPi = new Dadata(dadata)
const MiscAPI = new Misc(axiosInstance)
const OrderAPI = new Order(http)

export const userApi = {
  login: (login: string | number, password: string) => ClientAPI.login(login, password),
  ping: (id: any) => ClientAPI.ping(id),
  get: (id: string | number) => ClientAPI.getById(id),
  setOrder: (id: string | number, data: any) => ClientAPI.setOrder(id, data),
  setAliases: (id: string | number, data: any) => ClientAPI.setAliases(id, data),
}

export const addressesApi = {
  suggestions: (query: string) => DadataAPi.get(query),
  latLon: (query: string) => MiscAPI.geocode(query),
}

export const ordersApi = {
  send: (data: any) => OrderAPI.send(data),
}
