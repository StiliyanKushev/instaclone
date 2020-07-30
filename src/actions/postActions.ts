import { IPost } from './../shared/PostsPartial/PostsPartial';
import { AppActions } from "./types/actions";
import { Dispatch } from "react";
import IGenericResponse from "../types/response";
import { uploadPost, commentPost , likePost } from "../handlers/post";

export const ADD_POSTS_HOME = (posts:Array<IPost>):AppActions => ({
    type: 'ADD_POSTS_HOME',
    payload: {
        posts
    }
})

export const CALL_POST_LOADING = ():AppActions => ({
    type: 'SET_POST_LOADING',
});

export const CALL_POST_UPLOAD_SUCCESS = (messege:string):AppActions => ({
    type: 'SET_POST_UPLOAD_SUCCESS',
    payload:{
        messege
    }
});

export const CALL_POST_UPLOAD_FAILURE = (messege:string):AppActions => ({
    type: 'SET_POST_UPLOAD_FAILURE',
    payload:{
        messege
    }
});

export const CALL_POST_COMMENT_SUCCESS = (postIndex:number,comment:string,messege:string):AppActions => ({
    type: 'SET_POST_COMMENT_SUCCESS',
    payload:{
        messege,
        postIndex,
        comment
    }
});

export const CALL_POST_LIKE_FAILURE = (messege:string):AppActions => ({
    type: 'SET_POST_LIKE_FAILURE',
    payload:{
        messege
    }
});

export const CALL_POST_LIKE_SUCCESS = (postIndex:number, messege:string):AppActions => ({
    type: 'SET_POST_LIKE_SUCCESS',
    payload:{
        messege,
        postIndex
    }
});

export const CALL_POST_COMMENT_FAILURE = (messege:string):AppActions => ({
    type: 'SET_POST_COMMENT_FAILURE',
    payload:{
        messege
    }
});

export const UPLOAD_POST = (form:FormData,username:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_POST_LOADING());

    uploadPost(form,username,token).then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_POST_UPLOAD_SUCCESS(res.messege));
        }
        else{
            dispatch(CALL_POST_UPLOAD_FAILURE(res.messege));
        }
    });
}

export const COMMENT_POST = (postIndex:number,postId:string,username:string,comment:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_POST_LOADING());

    commentPost(postId,comment,username,token).then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_POST_COMMENT_SUCCESS(postIndex,comment,res.messege));
        }
        else{
            dispatch(CALL_POST_COMMENT_FAILURE(res.messege));
        }
    });
}

export const LIKE_POST = (postIndex:number,postId:string,username:string,token:string) => (dispatch:Dispatch<AppActions>):Promise<IGenericResponse> => {
    let promise:Promise<IGenericResponse> = likePost(postId,username,token);
    promise.then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_POST_LIKE_SUCCESS(postIndex,res.messege));
        }
        else{
            dispatch(CALL_POST_LIKE_FAILURE(res.messege));
        }
    });

    return promise;
}