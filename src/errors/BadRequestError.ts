import { AppError } from './AppError.ts'

export class BadRequestError extends AppError {
  constructor(message = 'BadRequest') {
    super(message, 400)
  }
}
