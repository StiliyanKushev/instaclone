import { IPost } from './../../shared/PostsPartial/PostsPartial';
import { IPostComment } from '../../shared/PostsPartial/PostsPartial';

const SET_POST_UPLOAD_SUCCESS = 'SET_POST_UPLOAD_SUCCESS';
const SET_POST_UPLOAD_FAILURE = 'SET_POST_UPLOAD_FAILURE';
const SET_POST_COMMENT_SUCCESS = 'SET_POST_COMMENT_SUCCESS';
const SET_TOGGLE_FULL_POST_VIEW = 'SET_TOGGLE_FULL_POST_VIEW';
const SET_POST_COMMENT_FAILURE = 'SET_POST_COMMENT_FAILURE';
const SET_FULL_POST_COMMENT_SUCCESS = 'SET_FULL_POST_COMMENT_SUCCESS';
const SET_FULL_POST_COMMENT_FAILURE = 'SET_FULL_POST_COMMENT_FAILURE';
const SET_FULL_POST_DATA_VIEW = 'SET_FULL_POST_DATA_VIEW';
const SET_POST_LIKE_SUCCESS = 'SET_POST_LIKE_SUCCESS';
const SET_POST_LIKE_FAILURE = 'SET_POST_LIKE_FAILURE';
const SET_FULL_POST_LIKE_SUCCESS = 'SET_FULL_POST_LIKE_SUCCESS';
const SET_FULL_POST_LIKE_FAILURE = 'SET_FULL_POST_LIKE_FAILURE';
const SET_POST_LOADING = 'SET_POST_LOADING';
const ADD_COMMENTS_POST = 'ADD_COMMENTS_POST';
const ADD_POSTS_HOME = 'ADD_POSTS_HOME';
const SET_POST_CLEAR = 'SET_POST_CLEAR';
const SET_FIX_POST_AFTER_UPDATE = 'SET_FIX_POST_AFTER_UPDATE';

export  interface setPostLoading{
    type: typeof SET_POST_LOADING,
}

export  interface setPostClear{
    type: typeof SET_POST_CLEAR,
}

export interface setPostUploadSuccess {
    type: typeof SET_POST_UPLOAD_SUCCESS,
    payload:{
        messege:string
    }
}

export interface setFixPostAfterUpdate {
    type: typeof SET_FIX_POST_AFTER_UPDATE,
    payload:{
        arr:[{index:number,post:IPost}]
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
        comment:IPostComment,
    }
}

export interface setPostCommentFailure {
    type: typeof SET_POST_COMMENT_FAILURE,
    payload:{
        messege:string
    }
}

export interface setFullPostCommentSuccess {
    type: typeof SET_FULL_POST_COMMENT_SUCCESS,
    payload:{
        messege:string,
        comment:IPostComment,
    }
}

export interface setFullPostCommentFailure {
    type: typeof SET_FULL_POST_COMMENT_FAILURE,
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

export interface addCommentsPost {
    type: typeof ADD_COMMENTS_POST,
    payload: {
        comments:Array<IPostComment>
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
setFixPostAfterUpdate |
setFullPostCommentFailure | 
setFullPostCommentSuccess | 
setPostUploadFailure | 
setPostUploadSuccess | 
setFullPostDataView |
setPostLikeFailure |
setPostLikeSuccess | 
addCommentsPost |
setPostLoading | 
addPostsHome |
setPostClear;