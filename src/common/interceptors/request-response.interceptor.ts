import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestMethod,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RequestResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req = ctx.getRequest();
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (!isPublic) {
      const loggedInUser = req.user.user;
      const method = req.method;
      if (method == RequestMethod[RequestMethod.POST]) {
        req.body.createdBy = loggedInUser.id;
      }
      if (method == RequestMethod[RequestMethod.PATCH]) {
        req.body.updatedBy = loggedInUser.id;
      }
      if (method == RequestMethod[RequestMethod.DELETE]) {
        req.body.deletedBy = loggedInUser.id;
      }
    }
    return next.handle().pipe(map((data) => ({ data })));
  }
}
