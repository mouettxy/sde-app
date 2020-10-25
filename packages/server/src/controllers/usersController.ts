import { api } from './../server'
import bcrypt from 'bcryptjs'
import { NextFunction } from 'connect'
import express from 'express'
import { parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { UserModel } from '../models'

export class UsersController {
  private model = UserModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.model
      .find()
      .then((model) => {
        response.status(200)
        response.send(model)
      })
      .catch((error: Error) => {
        next(new HttpException(500, error.message))
      })
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.model
      .findById(id)
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

  public getPaginated = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const { query, options } = parsePaginateResponse(request.query, this.model)

    try {
      // @ts-ignore
      const paginated = await this.model.paginate(query, options)
      response.status(200)
      response.send(paginated)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public updateById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id: string = request.params.id
    const userData = request.body

    // @ts-ignore
    await this.model.findByIdAndUpdate(id, userData, { new: true }).then((user) => {
      if (user) {
        api.io.emit('updated user', user, userData)
        api.io.emit('update users')
        response.status(200)
        response.send(user)
      } else {
        next(new ObjectNotFoundException(this.model.modelName, id))
      }
    })
  }

  public deleteById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = request.params.id
    await this.model.findByIdAndDelete(id).then((saved) => {
      if (saved) {
        api.io.emit('deleted user', id)
        api.io.emit('update users')
        response.status(200)
        response.json({
          message: `Пользователь ${id} успешно удалён`,
        })
      } else {
        next(new ObjectNotFoundException(this.model.modelName, id))
      }
    })
  }
}
