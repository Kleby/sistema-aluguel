import { IUser } from "./iuser.model";

export interface IAuthResponse {
    message: string;
    token: string;
    user: IUser;
}
