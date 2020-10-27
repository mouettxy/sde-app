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

export type ClientAddress = { name: string; address: string; lat: number; lon: number; fields: AddressFields }

export type OrderAddress = { id: number; isAlias: boolean; completed: boolean } & ClientAddress

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

export type ClientOrder = {
  name: string
  route: OrderRoutes
  addressList: OrderAddress[]
  addressInfo: OrderInfo
}

export type ClientFree = {
  in: boolean
  out: boolean
  cash: boolean
  pay: boolean
  extraPoint: boolean
}

export type User = {
  createdAt: Date
  id: string
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
