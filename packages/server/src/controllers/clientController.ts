import bcrypt from 'bcryptjs'
import { api } from './../server'
import { NextFunction } from 'connect'
import express from 'express'
import { parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { ClientModel } from '../models'
import e from 'express'

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

  public ping = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id

    try {
      const client = this.model.findOne({ id })

      if (client) {
        response.status(200)
        response.send(true)
      } else {
        response.status(403)
        response.send(false)
      }
    } catch (error) {
      console.log(error)
      next(new HttpException(500, 'Ошибка сервера'))
    }
  }

  public login = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const login = request.body.login
    const password = request.body.password

    try {
      if (login && password) {
        const user = await this.model.findOne({ id: login })

        if (user) {
          if (!user.password && user.hash) {
            if (user.hash === password) {
              response.status(200)
              user.set('password', '')
              response.send(user)
            } else {
              response.status(403)
              response.send(false)
            }
          } else if (user.password) {
            const isPasswordsMatch = await bcrypt.compare(password, user.password)

            if (isPasswordsMatch) {
              response.status(200)
              user.set('password', '')
              response.send(user)
            } else {
              response.status(403)
              response.send(false)
            }
          } else {
            next(new HttpException(500, 'Ошибка сервера'))
          }
        } else {
          next(new HttpException(500, 'Ошибка сервера'))
        }
      } else {
        response.status(403)
        response.send(false)
      }
    } catch (error) {
      next(new HttpException(500, 'Ошибка сервера'))
    }
  }

  public getToken = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    // TODO
  }

  public addOrder = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id

    try {
      const user = await this.model.findOne({ id })

      if (user) {
        user.orders.push(request.body)
        await user.save()

        api.io.emit('updated client', user)
        api.io.emit('update clients')

        response.status(200)
        response.send(true)
      } else {
        next(new HttpException(500, 'Ошибка сервера'))
      }
    } catch (error) {
      next(new HttpException(500, 'Ошибка сервера'))
    }
  }

  public addAddress = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = request.params.id

    try {
      const user = await this.model.findOne({ id })

      if (user) {
        user.addresess.push(request.body)
        await user.save()

        api.io.emit('updated client', user)
        api.io.emit('update clients')

        response.status(200)
        response.send(true)
      } else {
        next(new HttpException(500, 'Ошибка сервера'))
      }
    } catch (error) {
      next(new HttpException(500, 'Ошибка сервера'))
    }
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
        api.io.emit('created client', saved)
        api.io.emit('update clients')
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
          api.io.emit('updated client', saved)
          api.io.emit('update clients')
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
          api.io.emit('deleted client', id)
          api.io.emit('update clients', id)
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
