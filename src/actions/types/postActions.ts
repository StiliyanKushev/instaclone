import { IPost } from './../../shared/PostsPartial/PostsPartial';

const SET_POST_UPLOAD_SUCCESS = 'SET_POST_UPLOAD_SUCCESS';
const SET_POST_UPLOAD_FAILURE = 'SET_POST_UPLOAD_FAILURE';
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

export interface addPostsHome {
    type: typeof ADD_POSTS_HOME,
    payload: {
        posts:Array<IPost>
    }
}

export type postActionTypes = setPostUploadSuccess | setPostUploadFailure | setPostLoading | addPostsHome; 