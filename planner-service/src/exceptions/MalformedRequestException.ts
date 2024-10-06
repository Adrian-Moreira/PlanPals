import { StatusCodes } from 'http-status-codes';
import { BaseException } from './BaseException';

export class MalformedRequestException extends BaseException {
  constructor({ requestType }: { requestType: string }) {
    super({
      name: 'MalformedRequestException',
      message: `The request is badly formatted. Request Type: ${requestType}`,
      status: StatusCodes.BAD_REQUEST,
    })

    console.error(this.message)
  }
}
