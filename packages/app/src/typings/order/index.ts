import { Client, ClientAddress } from '@/typings/client'
import { User } from '@/typings/user'

export type OrderPriceRoutes = {
  price: number
}
export type OrderPriceAddressesAdditionals = {
  entries: number
  price: number
}
export type OrderPriceAddresses = {
  bundles: number
  buyInBuyOut: number
  overall: number
  addresses: OrderPriceAddressesAdditionals
}
export type OrderPrice = {
  additionals: number
  discounted: number
  overall: number
  addresses: OrderPriceAddresses
  routes: OrderPriceRoutes
}
export type OrderAddress = {
  id: number
  isAlias: boolean
  completed: boolean
} & ClientAddress
export type OrderRoute = {
  to: string
  from: string
  distance: string
  timeString: string
  time: number
}
export type OrderRoutes = {
  routes: OrderRoute[]
  overallTime: number
  overallDistance: number
  overallTimeString: string
}
export type OrderInfo = {
  car: boolean
  quick: boolean
  comment: string
  whoPays: string
}
export type Order = {
  id: number
  month: string
  date: Date
  orderTime: Date
  orderFromTime: Date
  orderToTime: Date
  status: string
  transport: string
  food: boolean
  to: string
  from: string
  clientId: string
  clientName: string
  clientPhone: string
  clientRate: number
  region: string
  courier: string
  courierCredentials: string
  logist: string
  timeInTravel: number
  promocode: string
  discount: number
  debt: number
  express: boolean
  payed: boolean
  comment: string
  paymentWho: string
  paymentForm: string
  paymentType: string
  additionals: string
  mileage: number
  buyin: number
  total: number
  totalDiscounted: number
  totalAdditionals: number
  addresses: OrderAddress[]
  info: OrderInfo
  price: OrderPrice
  route: OrderRoutes
  client: Client
  expeditor: User
}
