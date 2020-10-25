import express from 'express'
import { UsersController } from '../controllers'
import { authenticationMiddleware } from '../middlewares'

export class UsersRouter {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const userController = new UsersController()
    this.initializeRoutes(userController)
  }

  public initializeRoutes(controller: any): void {
    const path = '/user'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/paginated`, controller.getPaginated)
      .get(`${path}/:id`, controller.getById)
      .put(`${path}/:id`, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
