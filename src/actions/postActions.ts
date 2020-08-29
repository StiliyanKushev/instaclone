import { IPost } from './../shared/PostsPartial/PostsPartial';
import { AppActions } from "./types/actions";
import { Dispatch } from "react";
import IGenericResponse from "../types/response";
import { uploadPost, commentPost , likePost } from "../handlers/post";
import { IPostComment } from '../shared/PostsPartial/PostsPartial';
import { IPostCommentResponse } from '../types/response';

export const ADD_POSTS_HOME = (posts:Array<IPost>):AppActions => ({
    type: 'ADD_POSTS_HOME',
    payload: {
        posts
    }
})

export const ADD_COMMENTS_POST = (comments:Array<IPostComment>):AppActions => ({
    type: 'ADD_COMMENTS_POST',
    payload: {
        comments
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

export const CALL_POST_COMMENT_SUCCESS = (postIndex:number,comment:IPostComment,messege:string):AppActions => ({
    type: 'SET_POST_COMMENT_SUCCESS',
    payload:{
        messege,
        postIndex,
        comment
    }
});

export const CALL_POST_COMMENT_FAILURE = (messege:string):AppActions => ({
    type: 'SET_POST_COMMENT_FAILURE',
    payload:{
        messege
    }
});

export const CALL_FULL_POST_COMMENT_SUCCESS = (comment:IPostComment,messege:string):AppActions => ({
    type: 'SET_FULL_POST_COMMENT_SUCCESS',
    payload:{
        messege,
        comment,
    }
});

export const CALL_FULL_POST_COMMENT_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FULL_POST_COMMENT_FAILURE',
    payload:{
        messege
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

export const CALL_FULL_POST_LIKE_FAILURE = (messege:string):AppActions => ({
    type: 'SET_FULL_POST_LIKE_FAILURE',
    payload:{
        messege
    }
});

export const CALL_FULL_POST_LIKE_SUCCESS = (messege:string):AppActions => ({
    type: 'SET_FULL_POST_LIKE_SUCCESS',
    payload:{
        messege,
    }
});

export const CALL_TOGGLE_FULL_POST_VIEW = (postIndex?:number):AppActions => ({
    type: 'SET_TOGGLE_FULL_POST_VIEW',
    payload: {
        postIndex: postIndex
    }
})

export const SET_FULL_POST_DATA_VIEW = (postData:IPost):AppActions => ({
    type: 'SET_FULL_POST_DATA_VIEW',
    payload: {
        postData: postData
    }
})

export const SET_POST_DATA_CLEAR = ():AppActions => ({
    type: 'SET_POST_CLEAR',
})

export const SET_FIX_POST_AFTER_UPDATE = (arr:[{index:number,post:IPost}]):AppActions => ({
    type: 'SET_FIX_POST_AFTER_UPDATE',
    payload:{
        arr
    }
})

export const CALL_FIX_POST_AFTER_UPDATE = (arr:[{index:number,post:IPost}]) => (dispatch:Dispatch<AppActions>) => {
    dispatch(SET_FIX_POST_AFTER_UPDATE(arr));
}

export const CALL_POST_DATA_CLEAR = () => (dispatch:Dispatch<AppActions>) => {
    dispatch(SET_POST_DATA_CLEAR());
}


export const CALL_FULL_POST_DATA_VIEW = (postData:IPost) => (dispatch:Dispatch<AppActions>) => {
    dispatch(SET_FULL_POST_DATA_VIEW(postData));
}

export const TOGGLE_FULL_POST_VIEW = (postIndex?:number) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_TOGGLE_FULL_POST_VIEW(postIndex));
}

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

export const COMMENT_FULL_POST = (comment:IPostComment,postId?:string,token?:string) => (dispatch:Dispatch<AppActions>) => {
    if(!postId || !token){
        dispatch(CALL_FULL_POST_COMMENT_SUCCESS(comment,'Full post commented.'));
    }
    else{
        dispatch(CALL_POST_LOADING());
        commentPost(postId,comment.content,comment.creator?.id as string,token).then((res:IPostCommentResponse) => {
            if(res.success){
                dispatch(CALL_FULL_POST_COMMENT_SUCCESS(res.comment,res.messege));
            }
            else{
                dispatch(CALL_FULL_POST_COMMENT_FAILURE(res.messege));
            }
        });
    }
}

export const COMMENT_POST = (postIndex:number,postId:string,userId:string,comment:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_POST_LOADING());

    let promise:Promise<IPostCommentResponse> = commentPost(postId,comment,userId,token);
    promise.then((res:IPostCommentResponse) => {
        if(res.success){
            dispatch(CALL_POST_COMMENT_SUCCESS(postIndex,res.comment,res.messege));
        }
        else{
            dispatch(CALL_POST_COMMENT_FAILURE(res.messege));
        }
    });

    return promise;
}

export const LIKE_POST = (postIndex:number,postId:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    let promise:Promise<IGenericResponse> = likePost(postId,userId,token);
    promise.then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_POST_LIKE_SUCCESS(postIndex,res.messege));
        }
        else{
            dispatch(CALL_POST_LIKE_FAILURE(res.messege));
        }
    });
}

export const LIKE_FULL_POST = (postId?:string,username?:string,token?:string) => (dispatch:Dispatch<AppActions>) => {
    if(!postId || !username || !token){
        dispatch(CALL_FULL_POST_LIKE_SUCCESS('Full post liked.'));
    }
    else {
        let promise:Promise<IGenericResponse> = likePost(postId,username,token);
        promise.then((res:IGenericResponse) => {
            if(res.success){
                dispatch(CALL_FULL_POST_LIKE_SUCCESS(res.messege));
            }
            else{
                dispatch(CALL_FULL_POST_LIKE_FAILURE(res.messege));
            }
        });
    }
}