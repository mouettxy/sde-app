import { NextFunction } from 'connect'
import express from 'express'
import { isString, reduce } from 'lodash'
import { HttpException } from '../exceptions'
import { OrderModel } from '../models'

export class AutocompleteController {
  private order = OrderModel

  public getOrderCouriers = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.order
          .aggregate([
            {
              $match: { $or: [{ courier: new RegExp(search, 'i') }, { courierCredentials: new RegExp(search, 'i') }] },
            },
            { $group: { _id: { courier: '$courier', name: '$courierCredentials' } } },
            { $sample: { size: 10 } },
          ])
          .limit(10)

        const reduced = reduce(
          response,
          (a, e) => {
            if (e._id.name !== 'Курьер удалён') {
              a.push({ text: e._id.name, value: e._id.courier })

              return a
            }
          },
          [],
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }
}
