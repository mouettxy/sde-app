import { getModelForClass, pre, prop, plugin } from '@typegoose/typegoose'
import { UserState } from './sharedObjects'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'
@plugin(mongooseSearch)
@plugin(mongoosePaginate)
@pre<User>('save', async function () {
  if (this.phone) {
    this.phone = this.phone.replace(/[^0-9]/g, '')
  }
})
export class User {
  @prop({ required: true, searchable: true })
  public username: string

  @prop({ required: true })
  public password: string

  @prop({ searchable: true })
  public comment: string

  @prop({ required: true, searchable: true })
  public phone: string

  @prop({ default: '', searchable: true })
  public email: string

  @prop({ required: true, searchable: true })
  public credentials: string

  @prop({ default: false })
  public active: boolean

  @prop({ default: false })
  public canTakeOrders: boolean

  @prop({ searchable: true })
  public workTime: string

  @prop({ default: 'expeditor', searchable: true })
  public role: string

  @prop({ default: 'moto', searchable: true })
  public transport: string

  @prop({ default: 'Краснодар', searchable: true })
  public region: string

  @prop({ default: 3 })
  public permissionsLevel: number

  @prop({ default: true })
  public isSdeTransport: boolean

  @prop({ searchable: true })
  public lastActive: string

  @prop({ type: UserState, _id: false })
  public state: UserState
}

export const UserModel = getModelForClass(User)
