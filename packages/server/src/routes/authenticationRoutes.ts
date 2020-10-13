import express from 'express'
import { AuthenticationController } from '../controllers'
import { authenticationMiddleware } from '../middlewares'

export class AuthenticationRouter {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const authController = new AuthenticationController()
    this.initializeRoutes(authController)
  }

  public initializeRoutes(controller: any): void {
    const path = '/auth'

    this.expressRouter.post(`${path}/register`, authenticationMiddleware, controller.register)
    this.expressRouter.post(`${path}/login`, controller.login)
    this.expressRouter.post(`${path}/logout`, controller.logout)
  }
}
