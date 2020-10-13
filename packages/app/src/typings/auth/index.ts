export type AuthInput = {
  username: string
  password: string
}

export type RegisterInput = {
  username: string
  password: string
  comment?: string
  phone: string
  email?: string
  credentials: string
  active?: boolean
  canTakeOrders?: boolean
  workTime?: string
  role: string
  transport?: string
  region: string
  permissionsLevel?: number
  isSdeTransport?: boolean
}
