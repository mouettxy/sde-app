import { OrderInfo, OrderAddress, OrderRoutes, OrderPrice } from './sharedObjects'
import { prop, plugin, getModelForClass, pre } from '@typegoose/typegoose'

/* PLUGINS */
import autopopulate from 'mongoose-autopopulate'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'
import { ClientModel } from './clientModel'
import { UserModel } from './userModel'
import { chain, compact, includes, join, reduce } from 'lodash'

export const formatAddress = (address: OrderAddress) => {
  let phone = address.fields.phone
  if (phone) {
    phone = phone.replace(/\D/g, '')
    if (phone[0] === '7') {
      phone = '8' + phone.slice(1)
    } else {
      phone = '8' + phone
    }
  }
  const a = join(compact([address.address, address.fields.comment, phone || false]), ', ')
  const b = join(
    compact([
      address.fields.takeIn ? 'занос' : false,
      address.fields.takeOut ? 'вынос' : false,
      address.fields.buyin ? `выкуп(${address.fields.buyin})` : false,
      address.fields.buyout ? `выручка(${address.fields.buyout})` : false,
      address.fields.bundles ? `наборов ${address.fields.bundles}` : false,
    ]),
    ', ',
  )

  const c = b ? `${a} (${b})` : a
  return c
}

@plugin(mongooseSearch)
@plugin(mongoosePaginate)
@pre<Order>('save', async function () {
  if (this.isNew) {
    if (!this.id) {
      this.id = (await OrderModel.findOne().sort({ id: -1 })).id + 1
    }

    if (!this.info) {
      this.info = {
        car: false,
        quick: false,
        comment: '',
        whoPays: 'Заказчик',
      }
    }

    if (this.info.car) {
      this.transport = 'car'
    }

    this.express = this.info.quick
    this.comment = this.info.comment
    this.paymentWho = this.info.whoPays

    if (this.clientId !== 'Новый клиент') {
      const client = await ClientModel.findOne({ id: this.clientId })

      if (client) {
        this.clientName = client.name
        this.clientPhone = client.phone
        this.clientRate = client.rate
        this.region = client.region
        this.paymentForm = client.paymentForm
        this.paymentType = client.paymentType
      }
    }

    if (this.route) {
      this.mileage = this.route.overallDistance
      this.timeInTravel = this.route.overallTime
    }

    this.total = this.price.overall
    this.totalDiscounted = this.price.discounted
    this.totalAdditionals = this.price.additionals

    this.buyin = reduce(
      this.addresses,
      (a, e) => {
        a += e.fields.buyin
        return a
      },
      0,
    )

    this.from = formatAddress(this.addresses[0])
    this.to = chain(this.addresses.slice(1))
      .map((e: OrderAddress) => formatAddress(e))
      .join(' ---> ')
      .value()

    this.price = null
    this.route = null
    this.info = null

    if (this.courier) {
      const user = await UserModel.findOne({ username: this.courier })

      if (user) {
        this.courierCredentials = user.credentials
      } else {
        this.courierCredentials = 'Курьер удалён'
      }
    }
  }

  if (includes(['Закрыта', 'Не состоялась'], this.status)) {
    this.closedAt = new Date()
  }

  if (includes(['В работе'], this.status)) {
    this.inworkAt = new Date()
  }
})
@plugin(autopopulate)
export class Order {
  @prop({})
  public id: number

  @prop({ default: '' })
  public month: string

  @prop()
  public closedAt: Date

  @prop()
  public inworkAt: Date

  @prop({})
  public date: Date

  @prop({})
  public orderTime: Date

  @prop({})
  public orderFromTime: Date

  @prop({})
  public orderToTime: Date

  @prop({ default: 'Новая' })
  public status: string

  @prop({ default: 'moto' })
  public transport: string

  @prop({ default: 'Техника sde' })
  public transportType: string

  @prop({ default: '' })
  public to: string

  @prop({ default: '' })
  public from: string

  @prop({ default: '' })
  public clientId: string

  @prop({ default: 'Не указано' })
  public clientName: string

  @prop({ default: 'Не указано' })
  public clientPhone: string

  @prop({ default: 0 })
  public clientRate: number

  @prop({ default: 'Краснодар' })
  public region: string

  @prop({ default: 'Не назначен' })
  public courier: string

  @prop({ default: '' })
  public courierCredentials: string

  @prop({ default: '' })
  public logist: string

  @prop({ default: 0 })
  public timeInTravel: number

  @prop({ default: '' })
  public promocode: string

  @prop({ default: 0 })
  public discount: number

  @prop({ default: 0 })
  public debt: number

  @prop({ default: false })
  public express: boolean

  @prop({ default: false })
  public payed: boolean

  @prop({ default: '' })
  public comment: string

  @prop({ default: 'Не указано' })
  public paymentWho: string

  @prop({ default: 'Не указано' })
  public paymentForm: string

  @prop({ default: 'Не указано' })
  public paymentType: string

  @prop({ default: '' })
  public additionals: string

  @prop({ default: 0 })
  public mileage: number

  @prop({ default: 0 })
  public buyin: number

  @prop({ default: 0 })
  public total: number

  @prop({ default: 0 })
  public totalDiscounted: number

  @prop({ default: 0 })
  public totalAdditionals: number

  @prop({ _id: false, type: [OrderAddress] })
  public addresses: OrderAddress[]

  @prop({ _id: false, type: OrderInfo })
  public info: OrderInfo

  @prop({ _id: false, type: OrderPrice })
  public price: OrderPrice

  @prop({ _id: false, type: OrderRoutes })
  public route: OrderRoutes
}

export const OrderModel = getModelForClass(Order)
