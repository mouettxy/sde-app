import { HttpException } from './HttpException'

export class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Не удалось найти токен аутентификации')
  }
}
