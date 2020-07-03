const SET_POST_UPLOAD_SUCCESS = 'SET_POST_UPLOAD_SUCCESS';
const SET_POST_UPLOAD_FAILURE = 'SET_POST_UPLOAD_FAILURE';
const SET_POST_LOADING = 'SET_POST_LOADING';

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

export type postActionTypes = setPostUploadSuccess | setPostUploadFailure | setPostLoading; 