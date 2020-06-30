export const SET_AUTH_SUCCESS = 'SET_AUTH_SUCCESS';
export const SET_AUTH_FAILURE = 'SET_AUTH_FAILURE';
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING';
export const SET_AUTH_FINISH = 'SET_AUTH_FINISH';
export const SET_AUTH_LOGOUT = 'SET_AUTH_LOGOUT';
export const SET_AUTH_CHANGE_PASSWORD_SUCCESS = 'SET_AUTH_CHANGE_PASSWORD_SUCCESS';
export const SET_AUTH_CHANGE_PASSWORD_FAILURE = 'SET_AUTH_CHANGE_PASSWORD_FAILURE';
export const SET_AUTH_EDIT_PROFILE_SUCCESS = 'SET_AUTH_EDIT_PROFILE_SUCCESS';
export const SET_AUTH_EDIT_PROFILE_FAILURE = 'SET_AUTH_EDIT_PROFILE_FAILURE';

export interface setAuthSuccess {
    type: typeof SET_AUTH_SUCCESS,
    payload:{
        username:string,
        token:string,
        email:string,
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

export interface setAuthLogout {
    type: typeof SET_AUTH_LOGOUT,
}


export interface setAuthChangePasswordSuccess {
    type: typeof SET_AUTH_CHANGE_PASSWORD_SUCCESS,
    payload:{
        messege:string
    }
}

export interface setAuthChangePasswordFailure {
    type: typeof SET_AUTH_CHANGE_PASSWORD_FAILURE,
    payload:{
        messege:string
    }
}

export interface setAuthEditProfileSuccess {
    type: typeof SET_AUTH_EDIT_PROFILE_SUCCESS,
    payload:{
        messege:string,
        username:string,
        email:string
    }
}

export interface setAuthEditProfileFailure {
    type: typeof SET_AUTH_EDIT_PROFILE_FAILURE,
    payload:{
        messege:string
    }
}

export type authActionTypes = 
setAuthSuccess | 
setAuthFailure | 
setAuthLoading | 
setAuthFinish  |
setAuthLogout  |
setAuthChangePasswordSuccess |
setAuthChangePasswordFailure |
setAuthEditProfileSuccess    |
setAuthEditProfileFailure;