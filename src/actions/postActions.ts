import { IPost } from './../shared/PostsPartial/PostsPartial';
import { AppActions } from "./types/actions";
import { Dispatch } from "react";
import IGenericResponse from "../types/response";
import { uploadPost, commentPost, likePost, likeComment, getSubComments, getPostData, getOtherPosts, renewOtherPost } from '../handlers/post';
import { IPostComment } from '../shared/PostsPartial/PostsPartial';
import { IPostCommentResponse, ICommentsChunkResponse } from '../types/response';

export const SET_REPLYING_COMMENT = (commentIndex:number,subCommentIndex?:number):AppActions => ({
    type: 'SET_REPLYING_COMMENT',
    payload: {
        commentIndex,
        subCommentIndex
    }
})

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

export const CALL_COMMENT_LIKE_FAILURE = (messege:string):AppActions => ({
    type: 'SET_COMMENT_LIKE_FAILURE',
    payload:{
        messege
    }
});

export const CALL_COMMENT_LIKE_SUCCESS = (commentIndex:number, messege:string,subCommentIndex?:number):AppActions => ({
    type: 'SET_COMMENT_LIKE_SUCCESS',
    payload:{
        messege,
        commentIndex,
        subCommentIndex
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

export const CALL_FULL_POST_LIKE_SUCCESS = (messege:string,didFetch?:boolean):AppActions => ({
    type: 'SET_FULL_POST_LIKE_SUCCESS',
    payload:{
        messege,
        didFetch,
    }
});

export const CALL_TOGGLE_FULL_POST_VIEW = (postIndex?:number):AppActions => ({
    type: 'SET_TOGGLE_FULL_POST_VIEW',
    payload: {
        postIndex: postIndex
    }
})

export const CALL_TOGGLE_MORE_COMMENT = (commentIndex:number,comments?:Array<IPostComment>):AppActions => ({
    type: 'SET_TOGGLE_MORE_COMMENT',
    payload: {
        commentIndex: commentIndex,
        comments:comments
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

export const CALL_OTHER_POST_DATA_LOADING = ():AppActions => ({
    type: 'SET_OTHER_POST_DATA_LOADING',
})

export const CALL_OTHER_POST_DATA_LOADING_DONE = ():AppActions => ({
    type: 'SET_OTHER_POST_DATA_LOADING_DONE',
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

export const TOGGLE_MORE_COMMENT_NO_FETCH  = (commentIndex:number) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_TOGGLE_MORE_COMMENT(commentIndex));
}

export const CALL_RENEW_OTHER_POSTS = (index:number,post:{
    likesCount: number;
    source: {
        data: any;
        contentType: string;
    };
    _id: string;
}):AppActions => ({
    type: 'SET_RENEW_OTHER_POSTS',
    payload: {
        index:index,
        post:post
    }
})

export const RENEW_OTHER_POSTS = (id:string,index:number,others:[{
    likesCount: number;
    source: {
        data: any;
        contentType: string;
    };
    _id: string;
}],userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    renewOtherPost(id,others,userId,token).then((res:IGenericResponse & {post:{
        likesCount: number;
        source: {
            data: any;
            contentType: string;
        };
        _id: string;
    }}) => {
        if(res.success){
            dispatch(CALL_RENEW_OTHER_POSTS(index,res.post));
        }
    })
}

export const FETCH_FULL_POST_VIEW_AND_SAVE = (postId:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_OTHER_POST_DATA_LOADING());
    getPostData(postId,userId,token).then((res:IGenericResponse & {post:IPost}) => {
        if(res.success){
            dispatch(SET_FULL_POST_DATA_VIEW(res.post));
            dispatch(CALL_OTHER_POST_DATA_LOADING_DONE());
        }
    })
}

export const CALL_SAVE_OTHER_POSTS = (posts:[{
    likesCount:number,
    source:{
        data:any,
        contentType:string,
    },
    _id:string,
}]):AppActions => ({
    type: 'SET_SAVE_OTHER_POSTS',
    payload: {
        posts: posts
    }
})

export const FETCH_OTHER_POSTS = (otherId:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    getOtherPosts(otherId,userId,token).then((res:IGenericResponse & {posts:[{
        likesCount:number,
        source:{
            data:any,
            contentType:string,
        },
        _id:string,
    }]}) => {
        if(res.success){
            dispatch(CALL_SAVE_OTHER_POSTS(res.posts));
        }
    })
}

export const TOGGLE_MORE_COMMENT = (startIndex:number,stopIndex:number,commentId:string,commentIndex:number,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    let promise:Promise<ICommentsChunkResponse> = getSubComments(startIndex,stopIndex,commentId,userId,token);
    promise.then((res:ICommentsChunkResponse) => {
        if(res.success){
            if(res.comments.length > 0)
            dispatch(CALL_TOGGLE_MORE_COMMENT(commentIndex,res.comments));
            else
            dispatch(CALL_TOGGLE_MORE_COMMENT(commentIndex));
        }
    });
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

export const COMMENT_FULL_POST = (comment:IPostComment,postId?:string,token?:string,userId?:string,replyCommentId?:string) => (dispatch:Dispatch<AppActions>) => {
    if(!postId || !token){
        dispatch(CALL_FULL_POST_COMMENT_SUCCESS(comment,'Full post commented.'));
    }
    else{
        dispatch(CALL_POST_LOADING());

        let promise:Promise<IPostCommentResponse> = commentPost(postId,comment.content,userId as string,token,replyCommentId);
        promise.then((res:IPostCommentResponse) => {
            if(res.success){
                dispatch(CALL_FULL_POST_COMMENT_SUCCESS(res.comment,res.messege));
            }
            else{
                dispatch(CALL_FULL_POST_COMMENT_FAILURE(res.messege));
            }
        });
    }
}

export const COMMENT_POST = (postIndex:number,postId:string,userId:string,comment:string,token:string,replyCommentId?:string) => (dispatch:Dispatch<AppActions>) => {
    dispatch(CALL_POST_LOADING());

    let promise:Promise<IPostCommentResponse> = commentPost(postId,comment,userId,token,replyCommentId);
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

export const LIKE_COMMENT = (commentIndex:number,commentId:string,userId:string,token:string,subCommentIndex?:number) => (dispatch:Dispatch<AppActions>) => {
    let promise:Promise<IGenericResponse> = likeComment(commentId,userId,token);
    promise.then((res:IGenericResponse) => {
        if(res.success){
            dispatch(CALL_COMMENT_LIKE_SUCCESS(commentIndex,res.messege,subCommentIndex));
        }
        else{
            dispatch(CALL_COMMENT_LIKE_FAILURE(res.messege));
        }
    });
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

export const LIKE_FULL_POST = (postId?:string,userId?:string,token?:string) => (dispatch:Dispatch<AppActions>) => {
    if(!postId || !userId || !token){
        dispatch(CALL_FULL_POST_LIKE_SUCCESS('Full post liked.'));
    }
    else {
        let promise:Promise<IGenericResponse> = likePost(postId,userId,token);
        promise.then((res:IGenericResponse) => {
            if(res.success){
                dispatch(CALL_FULL_POST_LIKE_SUCCESS(res.messege,true));
            }
            else{
                dispatch(CALL_FULL_POST_LIKE_FAILURE(res.messege));
            }
        });
    }
}