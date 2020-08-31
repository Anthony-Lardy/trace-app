import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Context = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const context = request.user;

    return data ? context && context[data] : context;
  },
);