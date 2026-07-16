import { AppError } from './AppError.ts'

export class NotFoundError extends AppError {
  constructor(message = 'NotFound') {
    super(message, 404)
  }
}
