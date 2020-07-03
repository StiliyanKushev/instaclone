import { AppActions } from "./types/actions";
import { Dispatch } from "react";
import { sendUserAvatar } from "../handlers/user";
import IGenericResponse from "../types/response";

export const CALL_USER_LOADING = ():AppActions => ({
    type: 'SET_USER_LOADING',
});
export const CALL_USER_UPDATE_AVATER_SUCCESS = (messege:string):AppActions => ({
    type: 'SET_USER_UPDATE_AVATER_SUCCESS',
    payload:{
        messege
    }
});

export const CALL_USER_UPDATE_AVATER_FAILURE = (messege:string):AppActions => ({
    type: 'SET_USER_UPDATE_AVATER_FAILURE',
    payload:{
        messege
    }
});

export const UPDATE_AVATAR_USER = (form:FormData,username:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_USER_LOADING());

    sendUserAvatar(form,username,token).then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_USER_UPDATE_AVATER_SUCCESS(res.messege));
        }
        else{
            dispatch(CALL_USER_UPDATE_AVATER_FAILURE(res.messege));
        }
    });
}