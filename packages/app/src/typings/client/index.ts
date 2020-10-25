import { OrderAddress, OrderRoutes, OrderInfo } from '@/typings/order'

export type ClientOrder = {
  name: string
  route: OrderRoutes
  addressList: OrderAddress[]
  addressInfo: OrderInfo
}
export type AddressFields = {
  bus: boolean
  takeIn: boolean
  takeOut: boolean
  buyin: number
  buyout: number
  bundles: number
  datetime: string
  phone: string
  comment: string
}
export type ClientAddress = {
  name: string
  address: string
  lat: number
  lon: number
  fields: AddressFields
}
export type ClientFree = {
  in: boolean
  out: boolean
  cash: boolean
  pay: boolean
  extraPoint: boolean
}
export type Client = {
  _id: string
  createdAt: Date
  id: number
  password: string
  hash: string
  name: string
  phone: string
  email: string
  rate: number
  discount: number
  paymentType: string
  paymentWho: string
  paymentForm: string
  attract: string
  food: boolean
  free: ClientFree
  region: string
  addresess: ClientAddress[]
  orders: ClientOrder[]
  stopDelivery: boolean
  expressDelivery: boolean
  alwaysIn: boolean
  alwaysOut: boolean
}

export type RegisterClientInput = {
  id: number
  password?: string
  hash?: string
  name: string
  phone: string
  email?: string
  rate: number
  discount: number
  paymentType: string
  paymentWho: string
  paymentForm: string
  attract: string
  food: boolean
  free: ClientFree
  region: string
  addresess?: ClientAddress[]
  orders?: ClientOrder[]
  stopDelivery: boolean
  expressDelivery: boolean
  alwaysIn: boolean
  alwaysOut: boolean
}
