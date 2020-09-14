import { AppActions } from "./types/actions";
import { Dispatch } from "react";
import { sendUserAvatar, getSuggestedUsers } from '../handlers/user';
import IGenericResponse from "../types/response";
import { ICreator } from '../types/auth';
import { IPostsListGrid } from '../reducers/postReducer';
import { IPost } from '../shared/PostsPartial/PostsPartial';

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

export const CALL_GET_SUGGESTED_USERS_FAILURE = (messege:string):AppActions => ({
    type: 'GET_SUGGESTED_USERS_FAILURE',
    payload:{
        messege
    }
});

export const CALL_GET_SUGGESTED_USERS_SUCCESS = (users:Array<ICreator>,messege:string):AppActions => ({
    type: 'GET_SUGGESTED_USERS_SUCCESS',
    payload:{
        users,
        messege
    }
});

export const CALL_TOGGLE_USERS_LIST = (fetchFunction?:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>):AppActions => ({
    type: 'SET_TOGGLE_USERS_LIST',
    payload: {
        fetchFunction
    }
})

export const CALL_TOGGLE_USER_POSTS_LIST = (fetchFunction:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {posts:IPostsListGrid}>):AppActions => ({
    type: 'SET_TOGGLE_USER_POSTS_LIST',
    payload: {
        fetchFunction
    }
})

export const ADD_USER_POSTS_ROW_LIST = (posts:Array<IPost>):AppActions => ({
    type: 'ADD_USER_POSTS_ROW_LIST',
    payload: {
        posts
    }
})

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

export const GET_SUGGESTED_USERS = (userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    getSuggestedUsers(userId,token).then((res: {users:Array<ICreator>} & IGenericResponse) => {
        if(res.success){
            dispatch(CALL_GET_SUGGESTED_USERS_SUCCESS(res.users,res.messege));
        }
        else{
            dispatch(CALL_GET_SUGGESTED_USERS_FAILURE(res.messege));
        }
    })
}

export const TOGGLE_USERS_LIST = (fetchFunction?:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_TOGGLE_USERS_LIST(fetchFunction));
}

export const TOGGLE_USER_POSTS_LIST = (fetchFunction:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {posts:IPostsListGrid}>) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_TOGGLE_USER_POSTS_LIST(fetchFunction));
}

export const ADD_USER_LIST_ENTRIES = (entries:Array<ICreator>):AppActions => ({
    type: 'ADD_USER_LIST_ENTRIES',
    payload: {
        entries
    }
})