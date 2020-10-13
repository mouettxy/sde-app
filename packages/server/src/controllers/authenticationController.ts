import bcrypt from 'bcryptjs'
import { NextFunction } from 'connect'
import express from 'express'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose'
import { HttpException, UserWithThatUsernameAlreadyExistsException, WrongCredentialsException } from '../exceptions'
import { DataStoredInToken, TokenData } from '../interfaces'
import { UserModel } from '../models'

export class AuthenticationController {
  private user = UserModel

  private static createToken(user: Document): TokenData {
    const expiresIn = 60 * 60 * 24 * 7 // 7 days
    const secret = process.env.JWT_SECRET
    const dataStoredInToken: DataStoredInToken = {
      _id: user.get('_id'),
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    }
  }

  private static createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
  }

  public register = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    const userData = req.body
    if (await this.user.findOne({ username: userData.username })) {
      next(new UserWithThatUsernameAlreadyExistsException(userData.username))
    } else {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        const user = await this.user.create({
          ...userData,
          password: hashedPassword,
        })

        user.set('password', undefined)
        res.send(user)
      } catch (error) {
        next(new HttpException(500, error.message))
      }
    }
  }

  public login = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    const loginData = req.body
    const user = await this.user.findOne({ username: loginData.username })
    if (user) {
      const matchedPassword = await bcrypt.compare(loginData.password, user.get('password'))

      if (matchedPassword) {
        user.set('password', undefined)
        const tokenData = AuthenticationController.createToken(user)
        res.setHeader('Set-Cookie', [AuthenticationController.createCookie(tokenData)])
        res.send(user)
      } else {
        next(new WrongCredentialsException())
      }
    } else {
      next(new WrongCredentialsException())
    }
  }

  public logout = async (request: express.Request, response: express.Response): Promise<void> => {
    response.setHeader('Set-Cookie', 'Authorization=;Max-age=0')
    response.status(200).send({ status: 200, message: 'logout successfully' })
  }
}
