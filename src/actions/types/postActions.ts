import { IPost } from './../../shared/PostsPartial/PostsPartial';
import { IPostComment, IOtherPost } from '../../shared/PostsPartial/PostsPartial';

const SET_FULL_POST_COMMENT_FAILURE = 'SET_FULL_POST_COMMENT_FAILURE';
const SET_FULL_POST_COMMENT_SUCCESS = 'SET_FULL_POST_COMMENT_SUCCESS';
const SET_FULL_POST_LIKE_SUCCESS = 'SET_FULL_POST_LIKE_SUCCESS';
const SET_FULL_POST_LIKE_FAILURE = 'SET_FULL_POST_LIKE_FAILURE';
const SET_FULL_POST_SAVE_SUCCESS = 'SET_FULL_POST_SAVE_SUCCESS';
const SET_FULL_POST_SAVE_FAILURE = 'SET_FULL_POST_SAVE_FAILURE';
const SET_TOGGLE_FULL_POST_VIEW = 'SET_TOGGLE_FULL_POST_VIEW';
const SET_FIX_POST_AFTER_UPDATE = 'SET_FIX_POST_AFTER_UPDATE';
const SET_POST_COMMENT_SUCCESS = 'SET_POST_COMMENT_SUCCESS';
const SET_POST_COMMENT_FAILURE = 'SET_POST_COMMENT_FAILURE';
const SET_COMMENT_LIKE_FAILURE = 'SET_COMMENT_LIKE_FAILURE';
const SET_COMMENT_LIKE_SUCCESS = 'SET_COMMENT_LIKE_SUCCESS';
const SET_POST_UPLOAD_SUCCESS = 'SET_POST_UPLOAD_SUCCESS';
const SET_POST_UPLOAD_FAILURE = 'SET_POST_UPLOAD_FAILURE';
const SET_FULL_POST_DATA_VIEW = 'SET_FULL_POST_DATA_VIEW';
const SET_TOGGLE_MORE_COMMENT = 'SET_TOGGLE_MORE_COMMENT';
const SET_POST_LIKE_SUCCESS = 'SET_POST_LIKE_SUCCESS';
const SET_POST_LIKE_FAILURE = 'SET_POST_LIKE_FAILURE';
const SET_POST_SAVE_SUCCESS = 'SET_POST_SAVE_SUCCESS';
const SET_POST_SAVE_FAILURE = 'SET_POST_SAVE_FAILURE';
const SET_REPLYING_COMMENT = 'SET_REPLYING_COMMENT';
const ADD_COMMENTS_POST = 'ADD_COMMENTS_POST';
const SET_POST_LOADING = 'SET_POST_LOADING';
const ADD_POSTS_HOME = 'ADD_POSTS_HOME';
const SET_POST_CLEAR = 'SET_POST_CLEAR';
const SET_OTHER_POST_DATA_LOADING = 'SET_OTHER_POST_DATA_LOADING';
const SET_OTHER_POST_DATA_LOADING_DONE = 'SET_OTHER_POST_DATA_LOADING_DONE';
const SET_SAVE_OTHER_POSTS = 'SET_SAVE_OTHER_POSTS';
const SET_RENEW_OTHER_POSTS = 'SET_RENEW_OTHER_POSTS';
const RESET_POST_UPLOADED = 'RESET_POST_UPLOADED';
const ADD_EXPLORER_POSTS_ROW_LIST = 'ADD_EXPLORER_POSTS_ROW_LIST';

export interface resetPostUploaded{
    type: typeof RESET_POST_UPLOADED,
}

export interface setOtherPostDataLoading {
    type: typeof SET_OTHER_POST_DATA_LOADING,
}

export interface setRenewOtherPost {
    type: typeof SET_RENEW_OTHER_POSTS,
    payload: {
        index:number,
        post:{
            likesCount:number,
            source:{
                data:any,
                contentType:string,
            },
            _id:string,
        }
    }
}

export interface setSaveOtherPosts {
    type: typeof SET_SAVE_OTHER_POSTS,
    payload: {
        posts: [{
            likesCount:number,
            source:{
                data:any,
                contentType:string,
            },
            _id:string,
        }],
    }
}

export interface setOtherPostDataLoadingDone {
    type: typeof SET_OTHER_POST_DATA_LOADING_DONE,
}

export interface setToggleMoreComment {
    type: typeof SET_TOGGLE_MORE_COMMENT,
    payload: {
        commentIndex: number,
        comments?: Array<IPostComment>
    }
}
export interface setReplyingComment {
    type: typeof SET_REPLYING_COMMENT,
    payload: {
        commentIndex: number,
        subCommentIndex?:number
    }
}

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

export interface setPostSaveSuccess {
    type: typeof SET_POST_SAVE_SUCCESS,
    payload:{
        messege:string,
        postIndex: number,
    }
}

export interface setPostSaveFailure {
    type: typeof SET_POST_SAVE_FAILURE,
    payload:{
        messege:string
    }
}

export interface setCommentLikeSuccess {
    type: typeof SET_COMMENT_LIKE_SUCCESS,
    payload:{
        messege:string,
        commentIndex: number,
        subCommentIndex?:number
    }
}

export interface setCommentLikeFailure {
    type: typeof SET_COMMENT_LIKE_FAILURE,
    payload:{
        messege:string
    }
}

export interface setFullPostLikeSuccess {
    type: typeof SET_FULL_POST_LIKE_SUCCESS,
    payload:{
        messege:string,
        didFetch?:boolean,
        id?:string,
    }
}

export interface setFullPostLikeFailure {
    type: typeof SET_FULL_POST_LIKE_FAILURE,
    payload:{
        messege:string
    }
}

export interface setFullPostSaveSuccess {
    type: typeof SET_FULL_POST_SAVE_SUCCESS,
    payload:{
        messege:string,
        didFetch?:boolean,
        id?:string,
    }
}

export interface setFullPostSaveFailure {
    type: typeof SET_FULL_POST_SAVE_FAILURE,
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

export interface setToggleFullPostView {
    type: typeof SET_TOGGLE_FULL_POST_VIEW,
    payload: {
        postIndex?:number
    }
}

export interface setFullPostDataView {
    type: typeof SET_FULL_POST_DATA_VIEW,
    payload: {
        postData:IPost
    }
}

export interface addExplorerPostsRowList {
    type: typeof ADD_EXPLORER_POSTS_ROW_LIST,
    payload: {
        posts: Array<Array<IOtherPost>>
    }
}

export type postActionTypes = 
setOtherPostDataLoadingDone |
setFullPostCommentFailure | 
setFullPostCommentSuccess | 
setOtherPostDataLoading |
addExplorerPostsRowList |
setFullPostSaveSuccess |
setFullPostSaveFailure |
setFullPostLikeSuccess |
setFullPostLikeFailure |
setToggleFullPostView |
setPostCommentFailure | 
setPostCommentSuccess | 
setFixPostAfterUpdate |
setCommentLikeSuccess |
setCommentLikeFailure |
setPostUploadFailure | 
setToggleMoreComment |
setPostUploadSuccess |
setFullPostDataView |
setPostSaveSuccess |
setPostSaveFailure |
setReplyingComment |
setPostLikeFailure |
setPostLikeSuccess | 
resetPostUploaded |
setRenewOtherPost |
setSaveOtherPosts |
addCommentsPost |
setPostLoading | 
addPostsHome |
setPostClear;