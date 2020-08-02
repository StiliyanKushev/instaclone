import { IPost } from './../../shared/PostsPartial/PostsPartial';

const SET_POST_UPLOAD_SUCCESS = 'SET_POST_UPLOAD_SUCCESS';
const SET_POST_UPLOAD_FAILURE = 'SET_POST_UPLOAD_FAILURE';
const SET_POST_COMMENT_SUCCESS = 'SET_POST_COMMENT_SUCCESS';
const SET_TOGGLE_FULL_POST_VIEW = 'SET_TOGGLE_FULL_POST_VIEW';
const SET_POST_COMMENT_FAILURE = 'SET_POST_COMMENT_FAILURE';
const SET_FULL_POST_DATA_VIEW = 'SET_FULL_POST_DATA_VIEW';
const SET_POST_LIKE_SUCCESS = 'SET_POST_LIKE_SUCCESS';
const SET_POST_LIKE_FAILURE = 'SET_POST_LIKE_FAILURE';
const SET_FULL_POST_LIKE_SUCCESS = 'SET_FULL_POST_LIKE_SUCCESS';
const SET_FULL_POST_LIKE_FAILURE = 'SET_FULL_POST_LIKE_FAILURE';
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
export interface setFullPostLikeSuccess {
    type: typeof SET_FULL_POST_LIKE_SUCCESS,
    payload:{
        messege:string,
    }
}
export interface setFullPostLikeFailure {
    type: typeof SET_FULL_POST_LIKE_FAILURE,
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

export interface setToggleFullPostView{
    type: typeof SET_TOGGLE_FULL_POST_VIEW,
    payload: {
        postIndex?:number
    }
}

export interface setFullPostDataView{
    type: typeof SET_FULL_POST_DATA_VIEW,
    payload: {
        postData:IPost
    }
}

export type postActionTypes = 
setFullPostLikeSuccess |
setFullPostLikeFailure |
setToggleFullPostView |
setPostCommentFailure | 
setPostCommentSuccess | 
setPostUploadFailure | 
setPostUploadSuccess | 
setFullPostDataView |
setPostLikeFailure |
setPostLikeSuccess | 
setPostLoading | 
addPostsHome;