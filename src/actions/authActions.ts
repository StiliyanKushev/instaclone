import { AppActions } from "./types/actions";
import { IAuthResponse, IEditProfileResponse } from "../types/auth";
import { login, register, changePassword, editProfile } from "../handlers/auth";
import { ILoginState } from "../components/LoginView/LoginView";
import { IRegisterState } from "../components/RegisterView/RegisterView";
import { Dispatch } from "react";
import { IChangePasswordState } from "../components/ChangePassword/ChangePassword";
import IGenericResponse from "../types/response";
import { IEditProfileState } from "../components/EditProfile/EditProfile";
import { IForgotPasswordState } from "../components/ForgotPassword/ForgotPassword";
import { resetForgottenPassword } from "../handlers/mail";

export const CALL_AUTH_LOADING = ():AppActions => ({
    type: 'SET_AUTH_LOADING',
});

export const CALL_AUTH_LOGOUT = ():AppActions => ({
    type: 'SET_AUTH_LOGOUT',
});

export const CALL_AUTH_FINISH = ():AppActions => ({
    type: 'SET_AUTH_FINISH',
});

export const CALL_AUTH_CHANGE_PASSWORD_SUCCESS = (messege:string):AppActions => ({
    type: 'SET_AUTH_CHANGE_PASSWORD_SUCCESS',
    payload:{
        messege
    }
});

export const CALL_AUTH_CHANGE_PASSWORD_FAILURE = (messege:string):AppActions => ({
    type: 'SET_AUTH_CHANGE_PASSWORD_FAILURE',
    payload:{
        messege
    }
});

export const CALL_AUTH_RESET_FORGOTTEN_PASSWORD_SUCCESS = (messege:string):AppActions => ({
    type: 'SET_AUTH_RESET_FORGOTTEN_PASSWORD_SUCCESS',
    payload:{
        messege
    }
});

export const CALL_AUTH_RESET_FORGOTTEN_PASSWORD_FAILURE = (messege:string):AppActions => ({
    type: 'SET_AUTH_RESET_FORGOTTEN_PASSWORD_FAILURE',
    payload:{
        messege
    }
});

export const CALL_AUTH_EDIT_PROFILE_SUCCESS = (messege:string,email:string,username:string):AppActions => ({
    type: 'SET_AUTH_EDIT_PROFILE_SUCCESS',
    payload:{
        messege,
        email,
        username
    }
});

export const CALL_AUTH_EDIT_PROFILE_FAILURE = (messege:string):AppActions => ({
    type: 'SET_AUTH_EDIT_PROFILE_FAILURE',
    payload:{
        messege
    }
});

export const CALL_AUTH_SUCCESS = (email:string,username:string,token:string,messege:string):AppActions => ({
    type: 'SET_AUTH_SUCCESS',
    payload:{
        username,token,messege,email
    }
});

export const CALL_AUTH_FAILURE = (messege:string):AppActions => ({
    type: 'SET_AUTH_FAILURE',
    payload:{
        messege
    }
});

export const FINISH_AUTH = () => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_AUTH_FINISH());
}

export const LOGIN_AUTH = (state:ILoginState) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_AUTH_LOADING());

    login(state).then((res: IAuthResponse) => {
        if(res.success){
            dispatch(CALL_AUTH_SUCCESS(res.user.email,res.user.username,res.token,res.messege));
        }
        else{
            dispatch(CALL_AUTH_FAILURE(res.messege));
        }
    });
}

export const REGISTER_AUTH = (state:IRegisterState) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_AUTH_LOADING());

    register(state).then((res: IAuthResponse) => {
        if(res.success){
            dispatch(CALL_AUTH_SUCCESS(res.user.email,res.user.username,res.token,res.messege));
        }
        else{
            dispatch(CALL_AUTH_FAILURE(res.messege));
        }
    });
}

export const LOGOUT_AUTH = () => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_AUTH_LOGOUT());
    dispatch(CALL_AUTH_FINISH());
}

export const CHANGE_PASSWORD_AUTH = (state:IChangePasswordState,email:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_AUTH_LOADING());
    changePassword(state,email).then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_AUTH_CHANGE_PASSWORD_SUCCESS(res.messege));
        }
        else{
            dispatch(CALL_AUTH_CHANGE_PASSWORD_FAILURE(res.messege));
        }
    })
}

export const EDIT_PROFILE_AUTH = (state:IEditProfileState,email:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_AUTH_LOADING());
    editProfile(state,email,token).then((res:IEditProfileResponse) => {
        if(res.success){
            dispatch(CALL_AUTH_EDIT_PROFILE_SUCCESS(res.messege,res.user.email,res.user.username));
        }
        else{
            dispatch(CALL_AUTH_EDIT_PROFILE_FAILURE(res.messege));
        }
    })
}

export const RESET_FORGOTTEN_PASSWORD_AUTH = (state:IForgotPasswordState) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_AUTH_LOADING());
    resetForgottenPassword(state).then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_AUTH_RESET_FORGOTTEN_PASSWORD_SUCCESS(res.messege));
        }
        else{
            dispatch(CALL_AUTH_RESET_FORGOTTEN_PASSWORD_FAILURE(res.messege));
        }
    })
}