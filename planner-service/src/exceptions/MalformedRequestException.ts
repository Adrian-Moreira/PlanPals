// planner-service/src/exceptions/MalformedRequestException.ts`
import { StatusCodes } from 'http-status-codes';
import { BaseException } from './BaseException';

export class MalformedRequestException extends BaseException {
  constructor({ requestType, message }: { requestType: string, message: string }) {
    super({
      name: 'MalformedRequestException',
      message: `The request is badly formatted. Request Type: ${requestType}. ${message}`,
      status: StatusCodes.BAD_REQUEST,
    })

    console.error(this.message)
  }
}

