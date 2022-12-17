import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Authorized = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 从 ExecutionContext 获取请求对象
    const request = ctx.switchToHttp().getRequest();
    console.log('______________');
    console.log(request.user);
    // 返回请求对象的 user 属性
    return request.user;
  },
);
