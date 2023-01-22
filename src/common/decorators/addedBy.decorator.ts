import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AddedBy = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.body.addedBy;
  },
);
