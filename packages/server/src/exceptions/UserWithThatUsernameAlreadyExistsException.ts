import { HttpException } from './HttpException'

export class UserWithThatUsernameAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(400, `Пользователь с логином ${username} уже существует`)
  }
}
