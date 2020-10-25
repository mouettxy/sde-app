import { mongoose } from '@typegoose/typegoose'
import 'reflect-metadata'
import { seedDatabase } from './seed'
import RestApi from './RestApi'
import { AuthenticationRouter, OrdersRouter, UsersRouter } from './routes'
import { ClientRouter } from './routes/clientRoutes'
import { validateEnv } from './utils'

validateEnv()

export const api = new RestApi([new AuthenticationRouter(), new OrdersRouter(), new UsersRouter(), new ClientRouter()])

api.io.on('connection', (socket) => {
  console.log('connected socket')
})

api.listen()

async function seed() {
  await mongoose.connection.dropDatabase()

  seedDatabase()
}

if (process.env.NEED_SEED) {
  seed()
}
