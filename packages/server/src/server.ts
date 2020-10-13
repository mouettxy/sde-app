import { mongoose } from '@typegoose/typegoose'
import 'reflect-metadata'
import { seedDatabase } from './seed'
import RestApi from './RestApi'
import { AuthenticationRouter, OrdersRouter, UsersRouter } from './routes'
import { ClientRouter } from './routes/clientRoutes'
import { validateEnv } from './utils'

validateEnv()

const api = new RestApi([new AuthenticationRouter(), new OrdersRouter(), new UsersRouter(), new ClientRouter()])

api.io.on('connection', (socket) => {
  console.log('socket connected succesefully')
})

api.listen()

async function seed() {
  await mongoose.connection.dropDatabase()

  seedDatabase()
}

if (process.env.NEED_SEED) {
  seed()
}
