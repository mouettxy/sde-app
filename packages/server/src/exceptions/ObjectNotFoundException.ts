import { HttpException } from './HttpException'

export class ObjectNotFoundException extends HttpException {
  constructor(modelName: string, id: string) {
    super(404, `Модель ${modelName} с ID ${id} не найдена`)
  }
}
