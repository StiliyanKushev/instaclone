import { AppActions } from "./types/actions";
import { IAuthResponse } from "../interfaces/auth";
import { login, register, changePassword } from "../handlers/auth";
import { ILoginState } from "../components/LoginView/LoginView";
import { IRegisterState } from "../components/RegisterView/RegisterView";
import { Dispatch } from "react";
import ChangePassword, { IChangePasswordState } from "../components/ChangePassword/ChangePassword";
import IGenericResponse from "../interfaces/response";

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