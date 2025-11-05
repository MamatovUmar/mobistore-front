export interface IBaseResponse<T> {
  message?: string;
  status: boolean;
  data?: T;
}