import { ICreator } from '../../types/auth';
import IGenericResponse from '../../types/response';
import { IPostsListGrid } from '../../reducers/postReducer';
import { IOtherPost } from '../../shared/PostsPartial/PostsPartial';

const SET_USER_UPDATE_AVATER_SUCCESS = 'SET_USER_UPDATE_AVATER_SUCCESS';
const SET_USER_UPDATE_AVATER_FAILURE = 'SET_USER_UPDATE_AVATER_FAILURE';
const GET_SUGGESTED_USERS_SUCCESS = 'GET_SUGGESTED_USERS_SUCCESS';
const GET_SUGGESTED_USERS_FAILURE = 'GET_SUGGESTED_USERS_FAILURE';
const SET_TOGGLE_USERS_LIST = 'SET_TOGGLE_USERS_LIST';
const SET_TOGGLE_USER_POSTS_LIST = 'SET_TOGGLE_USER_POSTS_LIST';
const ADD_USER_LIST_ENTRIES = 'ADD_USER_LIST_ENTRIES';
const ADD_USER_POSTS_ROW_LIST = 'ADD_USER_POSTS_ROW_LIST';
const RESET_USER_AVATAR_UPLOAD = 'RESET_USER_AVATAR_UPLOAD';
const SET_USER_LOADING = 'SET_USER_LOADING';
const SET_USER_CLEAR = 'SET_USER_CLEAR';

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

export interface setToggleUserPostsList {
    type: typeof SET_TOGGLE_USER_POSTS_LIST,
    payload: {
        fetchFunction?:(startIndex:number,stopIndex:number) => Promise<IGenericResponse & {posts:IPostsListGrid}>
    }
}


export interface addUserListEntries {
    type: typeof ADD_USER_LIST_ENTRIES,
    payload: {
        entries: Array<ICreator>
    }
}

export interface addUserPostsRowList {
    type: typeof ADD_USER_POSTS_ROW_LIST,
    payload: {
        posts: Array<Array<IOtherPost>>
    }
}

export interface setUserClear{
    type: typeof SET_USER_CLEAR,
}

export interface resetUserAvatarUpload{
    type: typeof RESET_USER_AVATAR_UPLOAD,
}

export type userActionTypes = 
setUserUpdateAvatarSuccess |
setUserUpdateAvatarFailure |
getSuggestedUsersSuccess |
getSuggestedUsersFauilre |
setToggleUserPostsList |
resetUserAvatarUpload |
addUserPostsRowList |
setToggleUsersList |
addUserListEntries |
setUserLoading |
setUserClear;