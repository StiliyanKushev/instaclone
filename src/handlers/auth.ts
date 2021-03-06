import { IAuthResponse, IEditProfileResponse } from "../types/auth";
import { post } from "./api";
import { IRegisterState } from "../components/RegisterView/RegisterView";
import { ILoginState } from "../components/LoginView/LoginView";
import { IChangePasswordState } from "../components/ChangePassword/ChangePassword";
import IGenericResponse from "../types/response";
import { IEditProfileState } from "../components/EditProfile/EditProfile";

export async function register(state: IRegisterState) {
    return await post<IRegisterState, IAuthResponse>(state, '/auth/register').then((res: any) => res.data);
}

export function login(state: ILoginState) {
    return post<ILoginState, IAuthResponse>(state, '/auth/login').then((res: any) => res.data);
}

export function changePassword(state: IChangePasswordState, email: string) {
    interface IChangePasswordPost extends IChangePasswordState { email: string }
    return post<IChangePasswordPost, IGenericResponse>({ ...state, email }, '/auth/password-change').then((res: any) => res.data);
}

export function editProfile(state: IEditProfileState, email: string, token:string) {
    interface IEditProfilePost extends IEditProfileState { authEmail: string }
    return post<IEditProfilePost, IEditProfileResponse>({ ...state, authEmail: email }, '/auth/edit-profile',token).then((res: any) => res.data);
}