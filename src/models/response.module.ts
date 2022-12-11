export class CustomResponse<T> {
  code: number;
  message: string;
  body: T;
}
