import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ||
      'Success';

    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message,
        data,
      })),
    );
  }
}
