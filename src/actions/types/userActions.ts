import { ICreator } from '../../types/auth';
import IGenericResponse from '../../types/response';
import { IPostsListGrid } from '../../reducers/postReducer';
import { IOtherPost } from '../../shared/PostsPartial/PostsPartial';
import { IUserData } from '../../components/UserView/UserView';

const SET_USER_UPDATE_AVATER_SUCCESS = 'SET_USER_UPDATE_AVATER_SUCCESS';
const SET_UNFOLLOW_SUGGESTED_SUCCESS = 'SET_UNFOLLOW_SUGGESTED_SUCCESS';
const SET_USER_UPDATE_AVATER_FAILURE = 'SET_USER_UPDATE_AVATER_FAILURE';
const SET_UNFOLLOW_USER_LIST_SUCCESS = 'SET_UNFOLLOW_USER_LIST_SUCCESS';
const SET_UNFOLLOW_SUGGESTED_FAILURE = 'SET_UNFOLLOW_SUGGESTED_FAILURE';
const SET_UNFOLLOW_USER_LIST_FAILURE = 'SET_UNFOLLOW_USER_LIST_FAILURE';
const SET_UNFOLLOW_USER_PAGE_SUCCESS = 'SET_UNFOLLOW_USER_PAGE_SUCCESS';
const SET_UNFOLLOW_USER_PAGE_FAILURE = 'SET_UNFOLLOW_USER_PAGE_FAILURE';
const SET_CURRENT_USER_DATA_SUCCESS = 'SET_CURRENT_USER_DATA_SUCCESS';
const SET_CURRENT_USER_DATA_FAILURE = 'SET_CURRENT_USER_DATA_FAILURE';
const SET_FOLLOW_USER_LIST_SUCCESS = 'SET_FOLLOW_USER_LIST_SUCCESS';
const SET_FOLLOW_USER_LIST_FAILURE = 'SET_FOLLOW_USER_LIST_FAILURE';
const SET_FOLLOW_SUGGESTED_FAILURE = 'SET_FOLLOW_SUGGESTED_FAILURE';
const SET_FOLLOW_SUGGESTED_SUCCESS = 'SET_FOLLOW_SUGGESTED_SUCCESS';
const SET_FOLLOW_USER_PAGE_SUCCESS = 'SET_FOLLOW_USER_PAGE_SUCCESS';
const SET_FOLLOW_USER_PAGE_FAILURE = 'SET_FOLLOW_USER_PAGE_FAILURE';
const GET_SUGGESTED_USERS_SUCCESS = 'GET_SUGGESTED_USERS_SUCCESS';
const GET_SUGGESTED_USERS_FAILURE = 'GET_SUGGESTED_USERS_FAILURE';
const SET_TOGGLE_USER_POSTS_LIST = 'SET_TOGGLE_USER_POSTS_LIST';
const SET_USER_SUGGESTED_LOADING = 'SET_USER_SUGGESTED_LOADING';
const SET_USER_USER_LIST_LOADING = 'SET_USER_USER_LIST_LOADING';
const SET_USER_USER_PAGE_LOADING = 'SET_USER_USER_PAGE_LOADING';
const RESET_USER_AVATAR_UPLOAD = 'RESET_USER_AVATAR_UPLOAD';
const ADD_USER_POSTS_ROW_LIST = 'ADD_USER_POSTS_ROW_LIST';
const SET_TOGGLE_USERS_LIST = 'SET_TOGGLE_USERS_LIST';
const ADD_USER_LIST_ENTRIES = 'ADD_USER_LIST_ENTRIES';
const SET_USER_LOADING = 'SET_USER_LOADING';
const SET_USER_CLEAR = 'SET_USER_CLEAR';

export interface setUserLoading{
    type: typeof SET_USER_LOADING,
}

export interface setUserUserPageLoading{
    type: typeof SET_USER_USER_PAGE_LOADING,
}

export interface setUserUpdateAvatarSuccess {
    type: typeof SET_USER_UPDATE_AVATER_SUCCESS,
    payload:{
        messege:string
    }
}

export interface setUserSuggestedLoading {
    type: typeof SET_USER_SUGGESTED_LOADING,
    payload:{
        index:number
    }
}

export interface setUserUserListLoading {
    type: typeof SET_USER_USER_LIST_LOADING,
    payload:{
        index:number
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

export interface setCurrentUserDataSuccess {
    type: typeof SET_CURRENT_USER_DATA_SUCCESS,
    payload:{
        userData:IUserData,
        messege:string
    }
}

export interface setCurrentUserDataFailure {
    type: typeof SET_CURRENT_USER_DATA_FAILURE,
    payload:{
        messege:string
    }
}

export interface setFollowSuggestedSuccess {
    type: typeof SET_FOLLOW_SUGGESTED_SUCCESS,
    payload: {
        index: number,
        messege: string,
    }
}

export interface setUnFollowSuggestedSuccess {
    type: typeof SET_UNFOLLOW_SUGGESTED_SUCCESS,
    payload: {
        index: number,
        messege: string,
    }
}


export interface setFollowSuggestedFailure {
    type: typeof SET_FOLLOW_SUGGESTED_FAILURE,
    payload:{
        messege:string
    }
}

export interface setUnfollowSuggestedFailure {
    type: typeof SET_UNFOLLOW_SUGGESTED_FAILURE,
    payload:{
        messege:string
    }
}

export interface setFollowUserListSuccess {
    type: typeof SET_FOLLOW_USER_LIST_SUCCESS,
    payload: {
        index: number,
        messege: string,
    }
}

export interface setUnFollowUserListSuccess {
    type: typeof SET_UNFOLLOW_USER_LIST_SUCCESS,
    payload: {
        index: number,
        messege: string,
    }
}

export interface setFollowUserListFailure {
    type: typeof SET_FOLLOW_USER_LIST_FAILURE,
    payload:{
        messege:string
    }
}

export interface setUnfollowUserListFailure {
    type: typeof SET_UNFOLLOW_USER_LIST_FAILURE,
    payload:{
        messege:string
    }
}

export interface setFollowUserPageSuccess {
    type: typeof SET_FOLLOW_USER_PAGE_SUCCESS,
    payload: {
        messege: string,
    }
}

export interface setUnFollowUserPageSuccess {
    type: typeof SET_UNFOLLOW_USER_PAGE_SUCCESS,
    payload: {
        messege: string,
    }
}

export interface setFollowUserPageFailure {
    type: typeof SET_FOLLOW_USER_PAGE_FAILURE,
    payload:{
        messege:string
    }
}

export interface setUnfollowUserPageFailure {
    type: typeof SET_UNFOLLOW_USER_PAGE_FAILURE,
    payload:{
        messege:string
    }
}

export type userActionTypes = 
setUnfollowSuggestedFailure |
setUnFollowSuggestedSuccess |
setUnfollowUserPageFailure |
setUserUpdateAvatarSuccess |
setUnFollowUserListSuccess |
setUnfollowUserListFailure |
setUserUpdateAvatarFailure |
setUnFollowUserPageSuccess |
setFollowSuggestedFailure |
setFollowSuggestedSuccess |
setCurrentUserDataSuccess |
setCurrentUserDataFailure |
setFollowUserPageSuccess |
setFollowUserPageFailure |
setFollowUserListFailure |
setFollowUserListSuccess |
getSuggestedUsersSuccess |
getSuggestedUsersFauilre |
setUserSuggestedLoading |
setUserUserPageLoading |
setUserUserListLoading |
setToggleUserPostsList |
resetUserAvatarUpload |
addUserPostsRowList |
setToggleUsersList |
addUserListEntries |
setUserLoading |
setUserClear;