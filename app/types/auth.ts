import type { IBaseResponse } from ".";
import type { IUser } from "./user";

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface IAuthResponse extends IBaseResponse {
  user: IUser;
  token: string;
}
  