import { AppActions } from "./types/actions";
import { IAuthResponse } from "../interfaces/auth";
import { login, register } from "../handlers/auth";
import { ILoginState } from "../components/LoginView/LoginView";
import { IRegisterState } from "../components/RegisterView/RegisterView";
import { Dispatch } from "react";

export const CALL_AUTH_LOADING = ():AppActions => ({
    type: 'SET_AUTH_LOADING',
});

export const CALL_AUTH_LOGOUT = ():AppActions => ({
    type: 'SET_AUTH_LOGOUT',
});

export const CALL_AUTH_FINISH = ():AppActions => ({
    type: 'SET_AUTH_FINISH',
});

export const CALL_AUTH_SUCCESS = (username:string,token:string,messege:string):AppActions => ({
    type: 'SET_AUTH_SUCCESS',
    payload:{
        username,token,messege
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
            dispatch(CALL_AUTH_SUCCESS(res.user.username,res.token,res.messege));
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
            dispatch(CALL_AUTH_SUCCESS(res.user.username,res.token,res.messege));
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