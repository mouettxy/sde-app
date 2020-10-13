import { OrderInfo, OrderAddress, OrderRoutes, OrderPrice } from './sharedObjects'
import { prop, plugin, getModelForClass, Ref } from '@typegoose/typegoose'

/* PLUGINS */
import { AutoIncrement } from '../utils'
import autopopulate from 'mongoose-autopopulate'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'
import { Client } from './clientModel'
import { User } from './userModel'

@plugin(mongooseSearch)
@plugin(mongoosePaginate)
/* @plugin(AutoIncrement as any, {
  id: 'order_id',
  inc_field: 'id',
}) */
@plugin(autopopulate)
export class Order {
  @prop({ default: new Date() })
  public createdAt: Date

  @prop({})
  public id: number

  @prop({})
  public month: string

  @prop({})
  public date: string

  @prop({})
  public status: string

  @prop({})
  public orderTime: string

  @prop({})
  public orderFromTime: string

  @prop({})
  public orderToTime: string

  @prop({ _id: false, type: [OrderAddress] })
  public addresses: OrderAddress[]

  @prop({ _id: false, type: OrderInfo })
  public info: OrderInfo

  @prop({ _id: false, type: OrderPrice })
  public price: OrderPrice

  @prop({ _id: false, type: OrderRoutes })
  public route: OrderRoutes

  @prop({ autopopulate: true, ref: 'Client' })
  public client: Ref<Client>

  @prop({ autopopulate: true, ref: 'User' })
  public expeditor: Ref<User>
}

export const OrderModel = getModelForClass(Order)
