import { api } from './../server'
import { NextFunction } from 'connect'
import express from 'express'
import { parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { OrderModel } from '../models'
import { copyToExcel } from '../utils/helpers'
import { includes } from 'lodash'

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

  public getToCopyOne = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = request.params.id

    try {
      const order = await this.model.findOne({ id: id })
      response.status(200)
      response.send(
        copyToExcel(order, [
          {
            type: 'string',
            value: 'month',
          },
          {
            type: 'string',
            value: 'createdAt',
          },
          {
            type: 'string',
            value: 'logist',
          },
          {
            type: 'string',
            value: 'id',
          },
          {
            type: 'string',
            value: 'site',
          },
          {
            type: 'string',
            value: 'courierCredentials',
          },
          {
            type: 'custom',
            value: 'transport',
            fn: (value: string) => {
              if (includes(value, 'car')) {
                return 'Требуется автомобиль'
              }

              return ''
            },
          },
          {
            type: 'date',
            value: 'date',
            format: 'DD.MM.YYYY',
          },
          {
            type: 'date',
            value: 'orderTime',
            format: 'HH:mm',
          },
          {
            type: 'date',
            value: 'orderFromTime',
            format: 'DD.MM.YYYY HH:mm',
          },
          {
            type: 'date',
            value: 'orderToTime',
            format: 'DD.MM.YYYY HH:mm',
          },
          {
            type: 'string',
            value: 'da_1',
          },
          {
            type: 'string',
            value: 'from',
          },
          {
            type: 'string',
            value: 'da_2',
          },
          {
            type: 'string',
            value: 'to',
          },
          {
            type: 'string',
            value: 'clientId',
          },
          {
            type: 'string',
            value: 'clientName',
          },
          {
            type: 'string',
            value: 'clientPhone',
          },
          {
            type: 'string',
            value: 'additionals',
          },
          {
            type: 'int',
            value: 'buyin',
          },
          {
            type: 'int',
            value: 'totalAdditionals',
          },
          {
            type: 'string',
            value: 'paymentForm',
          },
          {
            type: 'int',
            value: 'total',
          },
          {
            type: 'boolean',
            value: 'express',
            onTrueValue: 'Да',
            onFalseValue: 'Нет',
          },
          {
            type: 'int',
            value: 'totalDiscounted',
          },
          {
            type: 'string',
            value: 'paymentWho',
          },
          {
            type: 'int',
            value: 'mileage',
          },
          {
            type: 'custom',
            value: 'timeInTravel',
            fn: (value: string) => {
              return `${value} м.`
            },
          },
          {
            type: 'string',
            value: 'promocode',
          },
          {
            type: 'string',
            value: 'discount',
          },
          {
            type: 'string',
            value: 'comment',
          },
          {
            type: 'string',
            value: 'paymentType',
          },
          {
            type: 'boolean',
            value: 'payed',
            onTrueValue: 'Да',
            onFalseValue: 'Нет',
          },
          {
            type: 'int',
            value: 'debt',
          },
          {
            type: 'string',
            value: 'region',
          },
          {
            type: 'string',
            value: 'transport',
          },
          {
            type: 'string',
            value: 'transportType',
          },
        ]),
      )
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
