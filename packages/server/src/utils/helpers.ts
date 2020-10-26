import { cloneDeep, each, includes, join, last, map } from 'lodash'
import { UserModel } from '../models'
import { NextFunction } from 'connect'
import moment from 'moment'
import express from 'express'
import { body, validationResult } from 'express-validator/check'

moment.locale('ru')

export function getAnonymousAnimal() {
  const animals = [
    'Неопознанный аллигатор',
    'Неопознанный муравьед',
    'Неопознанный броненосец',
    'Неопознанный зубр',
    'Неопознанный аксолотль',
    'Неопознанный барсук',
    'Неопознанная летучая мышь',
    'Неопознанный бобр',
    'Неопознанный буйвол',
    'Неопознанный верблюд',
    'Неопознанный хамелеон',
    'Неопознанный гепард',
    'Неопознанный бурундук',
    'Неопознанная шиншилла',
    'Неопознанная чупакабра',
    'Неопознанный баклан',
    'Неопознанный койот',
    'Неопознанная ворона',
    'Неопознанный динго',
    'Неопознанный динозавр',
    'Неопознанная собака',
    'Неопознанный дельфин',
    'Неопознанный дракон',
    'Неопознанная утка',
    'Неопознанный думбо',
    'Неопознанный слон',
    'Неопознанный хорек',
    'Неопознанная лиса',
    'Неопознанная лягушка',
    'Неопознанный жираф',
    'Неопознанный гусь',
    'Неопознанный суслик',
    'Неопознанный гризли',
    'Неопознанный хомяк',
    'Неопознанный еж',
    'Неопознанный бегемот',
    'Неопознанная гиена',
    'Неопознанный шакал',
    'Неопознанный горный козел',
    'Неопознанный ифрит',
    'Неопознанный игуана',
    'Неопознанный кенгуру',
    'Неопознанная коала',
    'Неопознанный кракен',
    'Неопознанный лемур',
    'Неопознанный леопард',
    'Неопознанный лев',
    'Неопознанная лама',
    'Неопознанный ламантин',
    'Неопознанная норка',
    'Неопознанная обезьяна',
    'Неопознанный лось',
    'Неопознанный нарвал',
    'Неопознанный орангутанг',
    'Неопознанная выдра',
    'Неопознанная панда',
    'Неопознанный пингвин',
    'Неопознанный утконос',
    'Неопознанный питон',
    'Неопознанная тыква',
    'Неопознанная квагга',
    'Неопознанный кролик',
    'Неопознанный енот',
    'Неопознанный носорог',
    'Неопознанная овца',
    'Неопознанная землеройка',
    'Неопознанный скунс',
    'Неопознанный медленный лори',
    'Неопознанная белка',
    'Неопознанный тигр',
    'Неопознанная черепаха',
    'Неопознанный единорог',
    'Неопознанный морж',
    'Неопознанный волк',
    'Неопознанный росомаха',
    'Неопознанный вомбат',
  ]

  return animals[Math.floor(Math.random() * animals.length)]
}

export const requiredFieldsHelper = (...args: string[]) => {
  const fields = []
  args.forEach((e) => {
    fields.push(body(e).not().isEmpty().withMessage('Необходимое поле'))
  })
  return fields
}

export const badRequestHelper = () => {
  return (req: express.Request, res: express.Response, next: NextFunction): void => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        status: 400,
        message: 'Bad Request',
        errors: validationErrors.array(),
      })
    } else {
      next()
    }
  }
}

export const parsePaginateResponse = (requestQuery, model = undefined, extendSearch = undefined) => {
  let query: any = {}

  const page = requestQuery.page
  const limit = requestQuery.limit
  const options: any = {
    page,
    limit,
  }

  if (requestQuery.sort) {
    try {
      options.sort = JSON.parse(`${requestQuery.sort}`)
    } catch (e) {
      // do nothing
    }
  }

  if (requestQuery.search) {
    if (model) {
      const searchQuery = model.searchBuilder(requestQuery.search)
      if (extendSearch) {
        if (parseInt(requestQuery.search)) {
          searchQuery.$and[0].$or.push({ id: { $gte: requestQuery.search, $lte: requestQuery.search } })
        }
      }
      query = {
        ...query,
        ...searchQuery,
      }
    }
  }

  if (requestQuery.filter) {
    const parsed = map(requestQuery.filter, (e) => {
      return JSON.parse(requestQuery.filter as string)
    })

    const filter: any = {}

    each(parsed, (e) => {
      if (e.type === 'in') {
        filter[e.key] = { $in: e.value }
      }
    })

    Object.assign(query, filter)
  }

  return {
    query,
    options,
  }
}

export function copyToExcel(
  data: Record<string, any>,
  schema: Array<{
    type: string
    value: string
    format?: string
    initialFormat?: string
    onTrueValue?: any
    onFalseValue?: any
    fn?: Function
  }>,
) {
  const ht = String.fromCharCode(0x09)
  const cr = String.fromCharCode(0x0d)
  const cf = String.fromCharCode(0x0a)

  const mappedData = map(schema, (e) => {
    let value: any = data[e.value]

    if (!value) {
      value = ''
    }

    if (e.type === 'date') {
      if (e.format && !e.initialFormat) {
        value = moment(value).format(e.format)
      } else if (e.format && e.initialFormat) {
        value = moment(value, e.initialFormat).format(e.format)
      } else {
        value = ''
      }
    }

    if (e.type === 'int') {
      value = parseInt(value) || 0
    }

    if (e.type === 'boolean') {
      if (e.onTrueValue && e.onFalseValue) {
        value = value ? e.onTrueValue : e.onFalseValue
      }
    }

    if (e.type === 'custom') {
      if (e.fn) {
        value = e.fn(value)
      }
    }

    return { field: e.value, value: String(value) }
  })

  const lastIndex = mappedData.length - 1

  const mappedResult = map(mappedData, (e, i) => {
    const value = e.value.replace(/(\r\n|\n|\r)/gm, '').replace('\t', '')

    if (value === '') {
      if (i === lastIndex) {
        return ht + cr + cf
      } else {
        return ht
      }
    }

    if (i === lastIndex) {
      return value + ht + cr + cf
    } else {
      return value + ht
    }
  })

  return join(mappedResult, '')
}

export function copyToExcelOrder() {
  return [
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
  ]
}
