import { userActionTypes } from "../actions/types/userActions";
import { ICreator } from '../types/auth';

export interface IUserState {
    error:boolean,
    messege:string,
    isUserLoading:boolean,
    isUserAvatarUpdated:boolean,
    suggestedUsers:[ICreator],
}

const userState:IUserState = {
    error:false,
    messege:'',
    isUserLoading:false,
    isUserAvatarUpdated:false,
    suggestedUsers:[] as any,
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

        default: {
            return {...state};
        }
    }
}

export default userReducer;