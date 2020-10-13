import { getModelForClass, pre, prop } from '@typegoose/typegoose'
import { UserState } from './sharedObjects'

@pre<User>('save', async function () {
  if (this.phone) {
    this.phone = this.phone.replace(/[^0-9]/g, '')
  }
})
export class User {
  @prop({ required: true })
  public username: string

  @prop({ required: true })
  public password: string

  @prop({})
  public comment: string

  @prop({ required: true })
  public phone: string

  @prop({ default: '' })
  public email: string

  @prop({ required: true })
  public credentials: string

  @prop({ default: false })
  public active: boolean

  @prop({ default: false })
  public canTakeOrders: boolean

  @prop({})
  public workTime: string

  @prop({ default: 'expeditor' })
  public role: string

  @prop({ default: 'moto' })
  public transport: string

  @prop({ default: 'Краснодар' })
  public region: string

  @prop({ default: 3 })
  public permissionsLevel: number

  @prop({ default: true })
  public isSdeTransport: boolean

  @prop({})
  public lastActive: string

  @prop({ type: UserState, _id: false })
  public state: UserState
}

export const UserModel = getModelForClass(User)
