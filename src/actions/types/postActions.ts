import { IPost } from './../../shared/PostsPartial/PostsPartial';

const SET_POST_UPLOAD_SUCCESS = 'SET_POST_UPLOAD_SUCCESS';
const SET_POST_UPLOAD_FAILURE = 'SET_POST_UPLOAD_FAILURE';
const SET_POST_COMMENT_SUCCESS = 'SET_POST_COMMENT_SUCCESS';
const SET_POST_COMMENT_FAILURE = 'SET_POST_COMMENT_FAILURE';
const SET_POST_LIKE_SUCCESS = 'SET_POST_LIKE_SUCCESS';
const SET_POST_LIKE_FAILURE = 'SET_POST_LIKE_FAILURE';
const SET_POST_LOADING = 'SET_POST_LOADING';
const ADD_POSTS_HOME = 'ADD_POSTS_HOME';

export  interface setPostLoading{
    type: typeof SET_POST_LOADING,
}
export interface setPostUploadSuccess {
    type: typeof SET_POST_UPLOAD_SUCCESS,
    payload:{
        messege:string
    }
}
export interface setPostUploadFailure {
    type: typeof SET_POST_UPLOAD_FAILURE,
    payload:{
        messege:string
    }
}
export interface setPostCommentSuccess {
    type: typeof SET_POST_COMMENT_SUCCESS,
    payload:{
        messege:string,
        postIndex:number,
        comment:string,
    }
}
export interface setPostCommentFailure {
    type: typeof SET_POST_COMMENT_FAILURE,
    payload:{
        messege:string
    }
}
export interface setPostLikeSuccess {
    type: typeof SET_POST_LIKE_SUCCESS,
    payload:{
        messege:string,
        postIndex: number,
    }
}
export interface setPostLikeFailure {
    type: typeof SET_POST_LIKE_FAILURE,
    payload:{
        messege:string
    }
}
export interface addPostsHome {
    type: typeof ADD_POSTS_HOME,
    payload: {
        posts:Array<IPost>
    }
}

export type postActionTypes = 
setPostCommentFailure | 
setPostCommentSuccess | 
setPostUploadFailure | 
setPostUploadSuccess | 
setPostLikeFailure |
setPostLikeSuccess | 
setPostLoading | 
addPostsHome;