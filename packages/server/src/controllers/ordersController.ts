import { api } from './../server'
import { NextFunction } from 'connect'
import express from 'express'
import { copyToExcelOrder, parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { OrderModel } from '../models'
import { copyToExcel } from '../utils/helpers'
import { includes, isNull, join, map } from 'lodash'

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
      response.send(copyToExcel(order, copyToExcelOrder()))
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getToCopyMany = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const dateFromFirst = request.query.dateFrom ? (request.query.dateFrom[0] as Date) : ''
    const dateFromSecond = request.query.dateFrom ? (request.query.dateFrom[1] as Date) : ''
    const dateToFirst = request.query.dateTo ? (request.query.dateTo[0] as Date) : ''
    const dateToSecond = request.query.dateTo ? (request.query.dateTo[1] as Date) : ''
    const courier = request.query.courier ? (request.query.courier as string) : ''
    let status: string | Array<string> = request.query.status ? (request.query.status as string) : 'Любой'
    if (status === 'Любой') {
      status = ['Новая', 'В работе', 'Закрыта', 'Не состоялась']
    } else if (status === 'Новые') {
      status = ['Новая', 'В работе']
    } else if (status === 'Закрытые') {
      status = ['Закрыта', 'Не состоялась']
    } else {
      status = [status]
    }

    const match: any = {
      status: {
        $in: ['Новая', 'В работе', 'Закрыта', 'Не состоялась'],
      },
      courier: new RegExp(courier, 'i'),
    }

    if (dateFromFirst && dateFromSecond) {
      match.date = {
        $gte: new Date(dateFromFirst),
        $lt: new Date(dateFromSecond),
      }
    }

    if (dateToFirst && dateToSecond) {
      match.closedAt = {
        $gte: new Date(dateToFirst),
        $lt: new Date(dateToSecond),
      }
    }

    const aggregated = await this.model.aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          id: -1,
        },
      },
    ])

    console.log(aggregated)

    const mapped = map(aggregated, (e) => {
      return copyToExcel(e, copyToExcelOrder())
    })

    const toCopy = join(mapped, '')

    response.status(200)
    response.send(toCopy)
  }

  public getFiltered = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    let status: any = request.query.status

    if (status === 'Новые') {
      status = ['Новая', 'В работе']
    } else if (status === 'Любые') {
      status = ['Новая', 'В работе', 'Закрыта', 'Не состоялась']
    } else {
      status = [status]
    }

    try {
      const orders = await this.model.aggregate([
        {
          $match: {
            status: { $in: status },
          },
        },
        {
          $sort: {
            id: -1,
          },
        },
      ])

      response.status(200)
      response.send(orders ? orders : [])
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
    const created = new this.model(request.body)

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

    for (const key in data) {
      if (['date', 'orderTime', 'orderFromTime', 'orderToTime'].includes(key)) {
        data[key] = new Date(data[key])
      }
    }

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
