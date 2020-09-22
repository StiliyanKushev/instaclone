import { AppActions } from "./types/actions";
import { Dispatch } from "react";
import { sendUserAvatar, getSuggestedUsers, getCurrentUserData, followUser, unfollowUser } from '../handlers/user';
import IGenericResponse from "../types/response";
import { ICreator } from '../types/auth';
import { IPostsListGrid } from '../reducers/postReducer';
import { IOtherPost } from '../shared/PostsPartial/PostsPartial';
import { IUserData } from '../components/UserView/UserView';

export const CALL_USER_LOADING = ():AppActions => ({
    type: 'SET_USER_LOADING',
});

export const CALL_USER_SUGGESTED_LOADING = (index:number):AppActions => ({
    type: 'SET_USER_SUGGESTED_LOADING',
    payload:{
        index
    }
});

export const CALL_USER_USER_LIST_LOADING = (index:number):AppActions => ({
    type: 'SET_USER_USER_LIST_LOADING',
    payload:{
        index
    }
});

export const CALL_USER_USER_PAGE_LOADING = ():AppActions => ({
    type: 'SET_USER_USER_PAGE_LOADING',
});

export const RESET_USER_AVATAR_UPLOAD = ():AppActions => ({
    type: 'RESET_USER_AVATAR_UPLOAD'
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

export const ADD_USER_POSTS_ROW_LIST = (posts: Array<Array<IOtherPost>>):AppActions => ({
    type: 'ADD_USER_POSTS_ROW_LIST',
    payload: {
        posts
    }
})

export const SET_USER_DATA_CLEAR = ():AppActions => ({
    type: 'SET_USER_CLEAR',
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

export const RESET_POST_UPLOADED = ():AppActions => ({
    type: 'RESET_POST_UPLOADED',
})

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

export const SET_CURRENT_USER_DATA = (username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    getCurrentUserData(username,userId,token).then((res: {user:IUserData} & IGenericResponse) => {
        if(res.success){
            dispatch(CALL_SET_CURRENT_USER_DATA_SUCCESS(res.user,res.messege));
        }
        else{
            dispatch(CALL_SET_CURRENT_USER_DATA_FAILURE(res.messege));
        }
    })
}

export const CALL_SET_CURRENT_USER_DATA_SUCCESS = (userData:IUserData,messege:string):AppActions => ({
    type: 'SET_CURRENT_USER_DATA_SUCCESS',
    payload: {
        userData,
        messege,
    }
})

export const CALL_SET_CURRENT_USER_DATA_FAILURE = (messege:string):AppActions => ({
    type: 'SET_CURRENT_USER_DATA_FAILURE',
    payload: {
        messege,
    }
})

export const FOLLOW_SUGGESTED = (index:number,username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_USER_SUGGESTED_LOADING(index))
    followUser(username,userId,token).then((res: IGenericResponse) => {
        if(res.success){
            dispatch(CALL_FOLLOW_SUGGESTED_SUCCESS(index,res.messege));
        }
        else{
            dispatch(CALL_FOLLOW_SUGGESTED_FAILURE(res.messege));
        }
    })
}

export const UNFOLLOW_SUGGESTED = (index:number,username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_USER_SUGGESTED_LOADING(index))
    unfollowUser(username,userId,token).then((res: IGenericResponse) => {
        if(res.success){
            dispatch(CALL_UNFOLLOW_SUGGESTED_SUCCESS(index,res.messege));
        }
        else{
            dispatch(CALL_UNFOLLOW_SUGGESTED_FAILURE(res.messege));
        }
    })
}

export const CALL_FOLLOW_SUGGESTED_SUCCESS = (index:number,messege:string):AppActions => ({
    type: 'SET_FOLLOW_SUGGESTED_SUCCESS',
    payload: {
        index,
        messege,
    }
})

export const CALL_UNFOLLOW_SUGGESTED_SUCCESS = (index:number,messege:string):AppActions => ({
    type: 'SET_UNFOLLOW_SUGGESTED_SUCCESS',
    payload: {
        index,
        messege,
    }
})

export const CALL_FOLLOW_SUGGESTED_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FOLLOW_SUGGESTED_FAILURE',
    payload: {
        messege,
    }
})

export const CALL_UNFOLLOW_SUGGESTED_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FOLLOW_SUGGESTED_FAILURE',
    payload: {
        messege,
    }
})



export const FOLLOW_USER_LIST = (index:number,username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_USER_USER_LIST_LOADING(index))
    followUser(username,userId,token).then((res: IGenericResponse) => {
        if(res.success){
            dispatch(CALL_FOLLOW_USER_LIST_SUCCESS(index,res.messege));
        }
        else{
            dispatch(CALL_FOLLOW_USER_LIST_FAILURE(res.messege));
        }
    })
}

export const UNFOLLOW_USER_LIST = (index:number,username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_USER_USER_LIST_LOADING(index))
    unfollowUser(username,userId,token).then((res: IGenericResponse) => {
        if(res.success){
            dispatch(CALL_UNFOLLOW_USER_LIST_SUCCESS(index,res.messege));
        }
        else{
            dispatch(CALL_UNFOLLOW_USER_LIST_FAILURE(res.messege));
        }
    })
}

export const CALL_FOLLOW_USER_LIST_SUCCESS = (index:number,messege:string):AppActions => ({
    type: 'SET_FOLLOW_USER_LIST_SUCCESS',
    payload: {
        index,
        messege,
    }
})

export const CALL_UNFOLLOW_USER_LIST_SUCCESS = (index:number,messege:string):AppActions => ({
    type: 'SET_UNFOLLOW_USER_LIST_SUCCESS',
    payload: {
        index,
        messege,
    }
})

export const CALL_FOLLOW_USER_LIST_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FOLLOW_USER_LIST_FAILURE',
    payload: {
        messege,
    }
})

export const CALL_UNFOLLOW_USER_LIST_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FOLLOW_USER_LIST_FAILURE',
    payload: {
        messege,
    }
})

export const FOLLOW_USER_PAGE = (username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_USER_USER_PAGE_LOADING())
    followUser(username,userId,token).then((res: IGenericResponse) => {
        if(res.success){
            dispatch(CALL_FOLLOW_USER_PAGE_SUCCESS(res.messege));
        }
        else{
            dispatch(CALL_FOLLOW_USER_PAGE_FAILURE(res.messege));
        }
    })
}

export const UNFOLLOW_USER_PAGE = (username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_USER_USER_PAGE_LOADING())
    unfollowUser(username,userId,token).then((res: IGenericResponse) => {
        if(res.success){
            dispatch(CALL_UNFOLLOW_USER_PAGE_SUCCESS(res.messege));
        }
        else{
            dispatch(CALL_UNFOLLOW_USER_PAGE_FAILURE(res.messege));
        }
    })
}

export const CALL_FOLLOW_USER_PAGE_SUCCESS = (messege:string):AppActions => ({
    type: 'SET_FOLLOW_USER_PAGE_SUCCESS',
    payload: {
        messege,
    }
})

export const CALL_UNFOLLOW_USER_PAGE_SUCCESS = (messege:string):AppActions => ({
    type: 'SET_UNFOLLOW_USER_PAGE_SUCCESS',
    payload: {
        messege,
    }
})

export const CALL_FOLLOW_USER_PAGE_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FOLLOW_USER_PAGE_FAILURE',
    payload: {
        messege,
    }
})

export const CALL_UNFOLLOW_USER_PAGE_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FOLLOW_USER_PAGE_FAILURE',
    payload: {
        messege,
    }
})

export const RESET_USER_DATA = ():AppActions => ({
    type: 'RESET_USER_DATA',
})