export type AddressFields = {
  bundles: number
  bus: boolean
  buyin: number
  buyout: number
  comment: string
  datetime: string
  phone: string
  takeIn: boolean
  takeOut: boolean
}

export type OrderAddress = {
  address: string
  completed: boolean
  fields: AddressFields
  id: number
  isAlias: boolean
  lat: number
  lon: number
  name: string
}

export type OrderInformation = {
  car: boolean
  comment: string
  quick: boolean
  whoPays: string
}

export type OrderRoutesPrices = {}
export type OrderAddressesPrices = {}

export type OrderPrices = {
  routes: OrderRoutesPrices | undefined
  addresses: OrderAddressesPrices | undefined
  overall: number
  discounted: number
  additionals: number
}

export type OrderRoutes = {
  to: string
  from: string
  timeString: string
  time: number
  distance: number
}

export type OrderRoute = {
  routes: OrderRoute[]
  overallDistance: number
  overallTime: number
  overallTimeString: string
}
