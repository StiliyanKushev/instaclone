import { userActionTypes } from "../actions/types/userActions";
import { ICreator } from '../types/auth';
import IGenericResponse from '../types/response';
import { IPostsListGrid } from './postReducer';

export interface IUserState {
    error:boolean,
    messege:string,
    isUserLoading:boolean,
    isUserAvatarUpdated:boolean,
    suggestedUsers:Array<ICreator>,
    usersList:Array<ICreator>,
    usersListToggled:boolean,
    currentPostSelectionFunction: (startIndex:number,stopIndex:number) => Promise<IGenericResponse & {posts:IPostsListGrid}>
    currentUsersFetchFunction: (startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>
    currentPostSelectionList: Array<IPostsListGrid>
}

const userState:IUserState = {
    error:false,
    messege:'',
    isUserLoading:false,
    isUserAvatarUpdated:false,
    suggestedUsers:[] as any,
    usersList:[] as any,
    usersListToggled: false,
    currentUsersFetchFunction: (startIndex:number,stopIndex:number) => (1 as any),
    currentPostSelectionFunction: (startIndex:number,stopIndex:number) => (1 as any),
    currentPostSelectionList: [] as any
}

const userReducer = (state = userState, action:userActionTypes) => {
    switch (action.type) {
        case 'SET_USER_LOADING':{
            return {
                ...state,
                error:false,
                isUserLoading:true,
                isUserAvatarUpdated:false,
            } as IUserState;
        }

        case 'SET_USER_UPDATE_AVATER_SUCCESS':{
            return {
                ...state,
                error:false,
                isUserLoading:false,
                isUserAvatarUpdated:true,
                messege:action.payload.messege,
            } as IUserState;
        }

        case 'SET_USER_UPDATE_AVATER_FAILURE':{
            return {
                ...state,
                error:true,
                isUserLoading:false,
                isUserAvatarUpdated:false,
                messege:action.payload.messege
            } as IUserState;
        }

        case 'GET_SUGGESTED_USERS_SUCCESS':{
            return {
                ...state,
                suggestedUsers: action.payload.users,
                error: false,
                messege: action.payload.messege,
            } as IUserState
        }

        case 'GET_SUGGESTED_USERS_FAILURE':{
            return {
                error: true,
                messege: action.payload.messege
            } as IUserState
        }

        case 'SET_TOGGLE_USERS_LIST':{
            if(state.usersListToggled)
            state.usersList = []

            return {
                ...state,
                usersListToggled: !state.usersListToggled,
                currentUsersFetchFunction: action.payload.fetchFunction
            } as IUserState
        }

        case 'SET_TOGGLE_USER_POSTS_LIST':{
            return {
                ...state,
                currentPostSelectionList: [],
                currentPostSelectionFunction: action.payload.fetchFunction
            } as IUserState
        }

        case 'ADD_USER_LIST_ENTRIES':{
            state.usersList = [...state.usersList,...action.payload.entries]

            return {
                ...state,
            } as IUserState
        }

        case 'ADD_USER_POSTS_ROW_LIST':{
            state.currentPostSelectionList.push([...action.payload.posts] as any)
            return {
                ...state,
            } as IUserState
        }

        case 'SET_USER_CLEAR':{
            return {
                ...state,
                currentPostSelectionList: [],
            } as IUserState
        }

        default: {
            return {...state};
        }
    }
}

export default userReducer;