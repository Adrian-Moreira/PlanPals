import { StatusCodes } from 'http-status-codes';
import { BaseException } from './BaseException';

export class RecordNotFoundException extends BaseException {
  constructor({ recordType, recordId }: { recordType: string; recordId?: string }) {
    super({
      name: 'RecordNotFoundException',
      message: `The requested record couldn't be found. Record Type: ${recordType}; Record ID: ${recordId}`,
      status: StatusCodes.NOT_FOUND,
    })
  }
}
