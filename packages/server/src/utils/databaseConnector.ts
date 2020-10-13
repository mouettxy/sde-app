import 'dotenv/config'
import mongoose from 'mongoose'
import AutoIncrementFactory from 'mongoose-sequence'

// @ts-ignore
export const AutoIncrement = AutoIncrementFactory(mongoose)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const { MONGO_USER, MONGO_PASSWORD, DB_CONNECTION_STRING, DB_SERVER } = process.env

export function initializePlugins(_connection): void {
  // do nothing right now
}

export function connectWithRetry(uri) {
  return mongoose.connect(uri, function (err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec')
      setTimeout(() => {
        connectWithRetry(uri)
      }, 5000)
    } else {
      console.log('MongoDB connected succesefuly')
    }
  })
}

export function connectToDatabase(): void {
  const DB_URL = `${DB_CONNECTION_STRING}${MONGO_USER}:${MONGO_PASSWORD}${DB_SERVER}?connectTimeoutMS=1000&bufferCommands=false&authSource=admin`
  console.log(DB_URL)
  connectWithRetry(DB_URL)
}
