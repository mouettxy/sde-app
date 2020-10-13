import { Order } from './orderModel'
import { prop, Ref } from '@typegoose/typegoose'

export class AddressFields {
  @prop({ default: false })
  public bus: boolean

  @prop({ default: false })
  public takeIn: boolean

  @prop({ default: false })
  public takeOut: boolean

  @prop({ default: 0 })
  public buyin: number

  @prop({ default: 0 })
  public buyout: number

  @prop({ default: 0 })
  public bundles: number

  @prop({ default: '' })
  public datetime: string

  @prop({ default: '' })
  public phone: string

  @prop({ default: '' })
  public comment: string
}

export class ClientAddress {
  @prop({})
  public name: string

  @prop({})
  public address: string

  @prop({})
  public lat: number

  @prop({})
  public lon: number

  @prop({ type: AddressFields, _id: false })
  public fields: AddressFields
}

export class OrderAddress extends ClientAddress {
  @prop({ required: true })
  public id: number

  @prop({ default: false })
  public isAlias: boolean

  @prop({ default: false })
  public completed: boolean
}

export class OrderRoute {
  @prop({ default: '' })
  public to: string

  @prop({ default: '' })
  public from: string

  @prop({ default: '' })
  public distance: string

  @prop({ default: '' })
  public timeString: string

  @prop({ default: 0 })
  public time: number
}

export class OrderRoutes {
  @prop({ type: [OrderRoute], _id: false })
  public routes: OrderRoute[]

  @prop({ required: true })
  public overallTime: number

  @prop({ required: true })
  public overallDistance: number

  @prop({ required: true })
  public overallTimeString: string
}

export class OrderInfo {
  @prop({ default: false })
  public car: boolean

  @prop({ default: false })
  public quick: boolean

  @prop({ default: '' })
  public comment: string

  @prop({ default: '' })
  public whoPays: string
}

export class ClientOrder {
  @prop({ required: true })
  public name: string

  @prop({ type: OrderRoutes, _id: false })
  public route: OrderRoutes

  @prop({ type: [OrderAddress], _id: false })
  public addressList: OrderAddress[]

  @prop({ type: OrderInfo, _id: false })
  public addressInfo: OrderInfo
}

export class ClientFree {
  @prop({ default: false })
  public in: boolean

  @prop({ default: false })
  public out: boolean

  @prop({ default: false })
  public cash: boolean

  @prop({ default: false })
  public pay: boolean

  @prop({ default: false })
  public extraPoint: boolean
}

export class OrderPriceRoutes {
  @prop({ default: 0 })
  public price: number
}

export class OrderPriceAddressesAdditionals {
  @prop({ default: 0 })
  public entries: number

  @prop({ default: 0 })
  public price: number
}

export class OrderPriceAddresses {
  @prop({ default: 0 })
  public bundles: number

  @prop({ default: 0 })
  public buyInBuyOut: number

  @prop({ default: 0 })
  public overall: number

  @prop({ _id: false, type: OrderPriceAddressesAdditionals })
  public addresses: OrderPriceAddressesAdditionals
}

export class OrderPrice {
  @prop({ default: 0 })
  public additionals: number

  @prop({ default: 0 })
  public discounted: number

  @prop({ default: 0 })
  public overall: number

  @prop({ _id: false, type: OrderPriceAddresses })
  public addresses: OrderPriceAddresses

  @prop({ _id: false, type: OrderPriceRoutes })
  public routes: OrderPriceRoutes
}

export class UserStateBreak {
  @prop({})
  public onBreak: boolean

  @prop({})
  public startTime: Date

  @prop({})
  public endTime: Date
}

export class UserStateOrders {
  @prop({ ref: 'Order' })
  public order: Ref<Order>

  @prop({ default: true })
  public onPause: boolean

  @prop({ default: new Date() })
  public takeAt: Date
}

export class UserStateRoute {}

export class UserState {
  @prop({ type: UserStateBreak, _id: false })
  public break: UserStateBreak

  @prop({ type: UserStateOrders, _id: false })
  public orders: UserStateOrders

  @prop({ type: UserStateRoute, _id: false })
  public route: UserStateRoute
}
