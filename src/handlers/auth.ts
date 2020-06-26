import { IAuthResponse } from "../interfaces/auth";
import { post } from "./api";
import { IRegisterState } from "../components/RegisterView/RegisterView";
import { ILoginState } from "../components/LoginView/LoginView";

export async function register(state:IRegisterState){
    return await post<IRegisterState,IAuthResponse>(state,'/auth/register');
}

export function login(state:ILoginState){
    return post<ILoginState,IAuthResponse>(state,'/auth/login');
}