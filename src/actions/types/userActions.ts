import { ICreator } from '../../types/auth';

const SET_USER_UPDATE_AVATER_SUCCESS = 'SET_USER_UPDATE_AVATER_SUCCESS';
const SET_USER_UPDATE_AVATER_FAILURE = 'SET_USER_UPDATE_AVATER_FAILURE';
const GET_SUGGESTED_USERS_SUCCESS = 'GET_SUGGESTED_USERS_SUCCESS';
const GET_SUGGESTED_USERS_FAILURE = 'GET_SUGGESTED_USERS_FAILURE';
const SET_USER_LOADING = 'SET_USER_LOADING';

export  interface setUserLoading{
    type: typeof SET_USER_LOADING,
}

export interface setUserUpdateAvatarSuccess {
    type: typeof SET_USER_UPDATE_AVATER_SUCCESS,
    payload:{
        messege:string
    }
}

export interface setUserUpdateAvatarFailure {
    type: typeof SET_USER_UPDATE_AVATER_FAILURE,
    payload:{
        messege:string
    }
}

export interface getSuggestedUsersSuccess {
    type: typeof GET_SUGGESTED_USERS_SUCCESS,
    payload: {
        users: [ICreator],
        messege: string,
    }
}

export interface getSuggestedUsersFauilre {
    type: typeof GET_SUGGESTED_USERS_FAILURE,
    payload: {
        messege: string,
    }
}

export type userActionTypes = 
setUserUpdateAvatarSuccess |
setUserUpdateAvatarFailure |
getSuggestedUsersSuccess |
getSuggestedUsersFauilre |
setUserLoading; 