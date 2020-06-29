import { authActionTypes } from "../actions/types/authActions";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export interface IAuthState {
    isAuthFinished:boolean,
    isLogged: boolean,
    isLoading:boolean,
    error:boolean,
    messege:string,
    username:string,
    token:string
}

const authState:IAuthState = {
    isAuthFinished:false,
    isLogged:cookies.get('isLogged') || false,
    isLoading:false,
    error:false,
    messege:'',
    username:cookies.get('username') || '',
    token:cookies.get('token') || ''
}

const authReducer = (state = authState, action:authActionTypes) => {
    switch (action.type) {
        case "SET_AUTH_LOADING": {
            return {
                ...state,
                isLoading:true,
                isLogged:false,
                error:false,
            } as IAuthState;
        }

        case "SET_AUTH_FAILURE": {
            return {
                ...state,
                isLoading:false,
                isLogged:false,
                error:true,
                messege:action.payload.messege
            } as IAuthState;
        }

        case "SET_AUTH_SUCCESS": {
            return { 
                ...state,
                isLoading:false,
                isLogged: true,
                error: false, 
                messege: action.payload.messege, 
                username: action.payload.username,
                token: action.payload.token
            } as IAuthState;
        }

        case "SET_AUTH_FINISH":{
            return {
                ...state,
                isAuthFinished:!state.isAuthFinished,
            } as IAuthState;
        }

        case "SET_AUTH_LOGOUT":{
            return {
                ...state,
                isLogged:false,
                token:'',
                username:'',
            } as IAuthState;
        }

        default: {
            return {...state};
        }
    }
}

export default authReducer;