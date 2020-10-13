import { cloneDeep, last } from 'lodash'
import { UserModel } from '../models'
import { NextFunction } from 'connect'
import express from 'express'
import { body, validationResult } from 'express-validator/check'

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

export const parsePaginateResponse = (requestQuery, needOffice = false, model = undefined) => {
  let query: any = {}
  if (needOffice) {
    query.office = requestQuery.office
  }

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
      console.log(e)
      // do nothing
    }
  }

  if (requestQuery.search) {
    if (model) {
      const searchQuery = model.searchBuilder(requestQuery.search)
      if (parseInt(requestQuery.search)) {
        searchQuery.$and[0].$or.push({ id: { $gte: requestQuery.search, $lte: requestQuery.search } })
      }
      query = {
        ...query,
        ...searchQuery,
      }
    }
  }

  if (requestQuery.filter) {
    const filter = JSON.parse(requestQuery.filter as string)
    const newFilter = {}
    for (const k in filter) {
      if (filter[k]) {
        if (parseInt(filter[k])) {
          newFilter[k] = { $gte: filter[k] }
        } else {
          newFilter[k] = { $regex: new RegExp(filter[k], 'i') }
        }
      }
    }
    Object.assign(query, newFilter)
  }

  if (requestQuery.master) {
    query.master = requestQuery.master
  }

  return {
    query,
    options,
  }
}
