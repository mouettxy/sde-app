import express from 'express'
import { AutocompleteController } from '../controllers'
import { authenticationMiddleware } from '../middlewares'

export class AutocompleteRouter {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const controller = new AutocompleteController()
    this.initializeRoutes(controller)
  }

  public initializeRoutes(controller: any): void {
    const path = '/autocomplete'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(`${path}/order-couriers`, controller.getOrderCouriers)
  }
}
