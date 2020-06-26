export const SET_AUTH_SUCCESS = 'SET_AUTH_SUCCESS';
export const SET_AUTH_FAILURE = 'SET_AUTH_FAILURE';
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING';
export const SET_AUTH_FINISH = 'SET_AUTH_FINISH';

export interface setAuthSuccess {
    type: typeof SET_AUTH_SUCCESS,
    payload:{
        username:string,
        token:string,
        messege:string
    }
}

export interface setAuthFailure {
    type: typeof SET_AUTH_FAILURE,
    payload:{
        messege:string
    }
}

export interface setAuthLoading {
    type: typeof SET_AUTH_LOADING,
}

export interface setAuthFinish {
    type: typeof SET_AUTH_FINISH,
}

export type authActionTypes = 
setAuthSuccess | 
setAuthFailure | 
setAuthLoading | 
setAuthFinish;