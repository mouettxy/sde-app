export type UserStateBreak = {
  onBreak: boolean
  startTime: Date
  endTime: Date
}

export type UserStateOrders = {
  order: string
  onPause: boolean
  takeAt: Date
}

export type UserStateRoute = {}

export type UserState = {
  break: UserStateBreak
  orders: UserStateOrders
  route: UserStateRoute
}

export type User = {
  _id?: string
  username: string
  password: string
  comment: string
  phone: string
  email: string
  credentials: string
  active: boolean
  canTakeOrders: boolean
  workTime: string
  role: 'courier' | 'administrator' | 'logist'
  transport: string
  region: string
  permissionsLevel: number
  isSdeTransport: boolean
  lastActive: string
  state: UserState
}
