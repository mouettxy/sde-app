import express from 'express'
import { ClientController } from '../controllers'
import { authenticationMiddleware } from '../middlewares'

export class ClientRouter {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const clientController = new ClientController()
    this.initializeRoutes(clientController)
  }

  public initializeRoutes(controller: any): void {
    const path = '/client'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/paginated`, controller.getPaginated)
      .get(`${path}/:id`, controller.getById)
      .post(`${path}/auth/ping`, controller.ping)
      .post(`${path}/auth/login`, controller.login)
      .post(`${path}/auth/token`, controller.getToken)
      .post(`${path}/client-alias`, controller.addAddress)
      .post(`${path}/client-order`, controller.addOrder)
      .post(`${path}`, controller.create)
      .put(`${path}/:id`, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
