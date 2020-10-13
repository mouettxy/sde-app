import bcrypt from 'bcryptjs'
import { NextFunction } from 'connect'
import express from 'express'
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

  public updateById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id: string = request.params.id
    const userData = request.body
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    // @ts-ignore
    await this.user.findOneAndUpdate(id, userData, { new: true }).then((user) => {
      if (user) {
        const updatedUser = {
          ...userData,
          password: hashedPassword,
        }
        response.status(200)
        response.send(updatedUser)
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
