import { getModelForClass, prop, plugin, ReturnModelType, Ref } from '@typegoose/typegoose'

import { ClientAddress, ClientOrder, ClientFree } from './sharedObjects'

/* PLUGINS */
import autopopulate from 'mongoose-autopopulate'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'

@plugin(mongoosePaginate)
@plugin(mongooseSearch)
@plugin(autopopulate as any)
export class Client {
  @prop({ default: new Date() })
  public createdAt: Date

  @prop({ unique: true, required: true, searchable: true })
  public id: string

  @prop({ default: null })
  public password: string

  @prop({})
  public hash: string

  @prop({ unique: true, required: true, searchable: true })
  public name: string

  @prop({ searchable: true })
  public phone: string

  @prop({ searchable: true })
  public email: string

  @prop({ default: 0 })
  public rate: number

  @prop({})
  public discount: number

  @prop({ searchable: true })
  public paymentType: string

  @prop({ searchable: true })
  public paymentWho: string

  @prop({ searchable: true })
  public paymentForm: string

  @prop({ searchable: true })
  public attract: string

  @prop({ default: false })
  public food: boolean

  @prop({ _id: false, type: ClientFree })
  public free: ClientFree

  @prop({})
  public region: string

  @prop({ _id: false, type: [ClientAddress] })
  public addresess: ClientAddress[]

  @prop({ _id: false, type: [ClientOrder] })
  public orders: ClientOrder[]

  @prop({ default: false })
  public stopDelivery: boolean

  @prop({ default: false })
  public expressDelivery: boolean

  @prop({ default: false })
  public alwaysIn: boolean

  @prop({ default: false })
  public alwaysOut: boolean
}

export const ClientModel = getModelForClass(Client)
