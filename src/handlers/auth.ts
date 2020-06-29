import { IAuthResponse } from "../interfaces/auth";
import { post } from "./api";
import { IRegisterState } from "../components/RegisterView/RegisterView";
import { ILoginState } from "../components/LoginView/LoginView";
import { IChangePasswordState } from "../components/ChangePassword/ChangePassword";
import IGenericResponse from "../interfaces/response";

export async function register(state:IRegisterState){
    return await post<IRegisterState,IAuthResponse>(state,'/auth/register');
}

export function login(state:ILoginState){
    return post<ILoginState,IAuthResponse>(state,'/auth/login');
}

export function changePassword(state:IChangePasswordState,email:string){
    interface IChangePasswordPost extends IChangePasswordState{
        email:string
    }
    return post<IChangePasswordPost,IGenericResponse>({...state,email},'/auth/passwordChange');
}