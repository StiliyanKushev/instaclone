import { userActionTypes } from "../actions/types/userActions";

export interface IUserState {
    error:boolean,
    messege:string,
    isUserLoading:boolean,
    isUserAvatarUpdated:boolean,
}

const userState:IUserState = {
    error:false,
    messege:'',
    isUserLoading:false,
    isUserAvatarUpdated:false,
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
                messege:action.payload.messege
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

        default: {
            return {...state};
        }
    }
}

export default userReducer;