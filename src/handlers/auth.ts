import { IRegisterState, ILoginState, IAuthResponse } from "../interfaces/auth";
import { post } from "./api";

export async function register(state:IRegisterState){
    return await post<IRegisterState,IAuthResponse>(state,'/auth/register');
}

export async function login(state:ILoginState){
    return await post<ILoginState,IAuthResponse>(state,'/auth/login');
}