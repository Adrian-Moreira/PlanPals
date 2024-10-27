import { StatusCodes } from 'http-status-codes'
import { BaseException } from './BaseException'

export class AuthorizationError extends BaseException {
  constructor({
    token,
    message = `Invalid or expired token: ${token}`,
  }: {
    token: string
    message?: string
  }) {
    super({
      name: 'AuthorizationError',
      message,
      status: StatusCodes.UNAUTHORIZED,
    })
  }
}
