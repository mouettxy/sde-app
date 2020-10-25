import { api } from './../server'
import { NextFunction } from 'connect'
import express from 'express'
import { parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { OrderModel } from '../models'

export class OrdersController {
  private model = OrderModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.model
      .find({})
      .then((model) => {
        response.status(200)
        response.send(model)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getPaginated = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const { query, options } = parsePaginateResponse(request.query, this.model)

    try {
      // @ts-ignore
      const orders = await this.model.paginate(query, options)
      response.status(200)
      response.send(orders)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }


  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.model
      .findOne({ id })
      .then((model) => {
        if (model) {
          response.status(200)
          response.send(model)
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
        }
      })
      .catch(() => next(new HttpException(422, 'Не удалось обработать данные')))
  }

  public create = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const data = request.body

    const created = new this.model({
      ...data,
    })

    await created
      .save()
      .then((saved) => {
        response.status(200)
        api.io.emit('created order', saved)
        api.io.emit('update orders')
        response.send(saved)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public updateById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = request.params.id
    const data = request.body


    await this.model
      .findOneAndUpdate({ id }, data, {
        new: true,
      })
      .then((saved) => {
        if (saved) {
          response.status(200)
          api.io.emit('updated order', saved)
          api.io.emit('update orders')
          response.send(saved)
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
        }
      })
      .catch((err) => {
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.',
          ),
        )
      })
  }

  public deleteById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = request.params.id
    await this.model
      .findOneAndDelete({ id })
      .then((saved) => {
        if (saved) {
          response.status(200)
          api.io.emit('deleted order', saved)
          api.io.emit('update orders')
          response.json({
            message: `Заявка ${id} удалена успешно`,
          })
          response.send()
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
        }
      })
      .catch(() => {
        next(new HttpException(422, 'Не удалось обработать данные'))
      })
  }
}
