import { api } from './../server'
import { NextFunction } from 'connect'
import express from 'express'
import { parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { ClientModel } from '../models'

export class ClientController {
  private model = ClientModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.model
      .find({})
      .then((orders) => {
        response.status(200)
        response.send(orders)
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
      const clients = await this.model.paginate(query, options)
      response.status(200)
      response.send(clients)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.model
      .findOne({ id })
      .then((saved) => {
        if (saved) {
          response.status(200)
          response.send(saved)
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
        }
      })
      .catch(() => next(new HttpException(422, 'Не удалось обработать данные')))
  }

  public create = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const data = request.body

    const model = new this.model({
      ...data,
    })

    await model
      .save()
      .then((saved) => {
        response.status(200)
        api.io.emit('update clients table', `Создан клиент с ID ${saved.id}`)
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
    const id: string = request.params.id
    const data = request.body
    await this.model
      .findOneAndUpdate({ id }, data, {
        new: true,
      })
      .then((saved) => {
        if (saved) {
          response.status(200)
          api.io.emit('update clients table', `Обновлён клиент с ID ${saved.id}`)
          response.send(saved)
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
        }
      })
      .catch(() => {
        next(new HttpException(422, 'Не удалось обработать данные'))
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
          api.io.emit('update clients table', `Удалён клиент с ID ${saved.id}`)
          response.send({ message: id })
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
        }
      })
      .catch(() => {
        next(new HttpException(422, 'Не удалось обработать данные'))
      })
  }
}
