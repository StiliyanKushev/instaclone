import { IValidationResultErrors } from "./validation";

export interface IRegisterState{
    username:string,
    email:string,
    password:string,
    r_password:string,
    errors:IValidationResultErrors
}

export interface ILoginState{
    email:string,
    password:string,
    errors:IValidationResultErrors
}

export interface IAuthResponse{
    messege:string,
    success:boolean,
    token:string,
    user:{
        username:string
    }
}