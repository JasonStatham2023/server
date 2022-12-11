import { createParamDecorator } from '@nestjs/common';

// 创建自定义的参数装饰器
export const Authorized = createParamDecorator((data: any, req: any) => {
  // 从请求对象中获取 JWT 中解析到的数据
  return req.user;
});
