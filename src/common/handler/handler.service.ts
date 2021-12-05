import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class HandlerService {
  dbError(err: Error) {
    console.log(`\n${err.name}:\n${err.message}`);
    if (
      err.name === 'SequelizeDatabaseError' ||
      err.name === 'SequelizeValidationError'
    ) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('Database Error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
