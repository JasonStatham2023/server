import { CustomResponse } from '../models';

export function generateSuccessResponse(
  message = '',
  body = {},
): CustomResponse<any> {
  return {
    code: 100,
    message,
    body,
  };
}

export function generateErrorResponse(code, message): CustomResponse<any> {
  return {
    code,
    message,
    body: {},
  };
}
