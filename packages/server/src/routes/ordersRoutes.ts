import express from 'express'
import { OrdersController } from '../controllers'
import { authenticationMiddleware } from '../middlewares'

export class OrdersRouter {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const orderController = new OrdersController()
    this.initializeRoutes(orderController)
  }

  public initializeRoutes(controller: any): void {
    const path = '/order'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/paginated`, controller.getPaginated)
      .get(`${path}/copy`, controller.getToCopyMany)
      .get(`${path}/:id`, controller.getById)
      .get(`${path}/:id/copy`, controller.getToCopyOne)
      .post(path, controller.create)
      .put(`${path}/:id`, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
