import { ICreator } from '../../types/auth';
import IGenericResponse from '../../types/response';

const SET_USER_UPDATE_AVATER_SUCCESS = 'SET_USER_UPDATE_AVATER_SUCCESS';
const SET_USER_UPDATE_AVATER_FAILURE = 'SET_USER_UPDATE_AVATER_FAILURE';
const GET_SUGGESTED_USERS_SUCCESS = 'GET_SUGGESTED_USERS_SUCCESS';
const GET_SUGGESTED_USERS_FAILURE = 'GET_SUGGESTED_USERS_FAILURE';
const SET_TOGGLE_USERS_LIST = 'SET_TOGGLE_USERS_LIST';
const ADD_USER_LIST_ENTRIES = 'ADD_USER_LIST_ENTRIES';
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
        users: Array<ICreator>,
        messege: string,
    }
}

export interface getSuggestedUsersFauilre {
    type: typeof GET_SUGGESTED_USERS_FAILURE,
    payload: {
        messege: string,
    }
}

export interface setToggleUsersList {
    type: typeof SET_TOGGLE_USERS_LIST,
    payload: {
        fetchFunction?:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>
    }
}

export interface addUserListEntries {
    type: typeof ADD_USER_LIST_ENTRIES,
    payload: {
        entries: Array<ICreator>
    }
}

export type userActionTypes = 
setUserUpdateAvatarSuccess |
setUserUpdateAvatarFailure |
getSuggestedUsersSuccess |
getSuggestedUsersFauilre |
setToggleUsersList |
addUserListEntries |
setUserLoading;