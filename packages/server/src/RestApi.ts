import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { errorMiddleware } from './middlewares'
import { connectToDatabase } from './utils'
import SocketIO from 'socket.io'
import http from 'http'
import cors from 'cors'

class RestApi {
  public expressApp: express.Application = express()
  public io: SocketIO.Server | null = null
  public server: any = null

  constructor(router: any) {
    connectToDatabase()
    this.initializeSocketIO()
    this.initializeMiddlewares()
    this.initializeRouter(router)
    this.initializeErrorHandling()
  }

  private initializeSocketIO() {
    const options = {}
    this.server = http.createServer(this.expressApp)
    this.io = SocketIO(this.server, options)
  }

  public listen(): void {
    this.server.listen(process.env.PORT)
    console.log('server listens on ' + process.env.PORT + ' port')
  }

  private initializeRouter(routers: any): void {
    routers.forEach((router) => {
      this.expressApp.use('/api/v1/', router.expressRouter)
    })
  }

  private initializeMiddlewares(): void {
    this.expressApp.use(cors())
    this.expressApp.use(bodyParser.json())
    this.expressApp.use(cookieParser())
  }

  private initializeErrorHandling(): void {
    this.expressApp.use(errorMiddleware)
  }
}

export default RestApi
