import { authActionTypes } from "../actions/types/authActions";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export interface IAuthState {
    isAuthFinished:boolean,
    isPasswordReseted:boolean,
    isPasswordChanged:boolean,
    isProfileEdited:boolean,
    isLogged: boolean,
    isLoading:boolean,
    error:boolean,
    messege:string,
    userId:string,
    username:string,
    token:string,
    email:string,
}

const authState:IAuthState = {
    isProfileEdited:false,
    isAuthFinished:false,
    isPasswordReseted:false,
    isPasswordChanged:false,
    isLogged:cookies.get('isLogged') || false,
    isLoading:false,
    error:false,
    messege:'',
    userId:cookies.get('userId') || '',
    username:cookies.get('username') || '',
    token:cookies.get('token') || '',
    email:cookies.get('email') || ''
}

const authReducer = (state = authState, action:authActionTypes) => {
    switch (action.type) {
        case "SET_AUTH_LOADING": {
            return {
                ...state,
                isLoading:true,
                isPasswordChanged:false,
                isPasswordReseted:false,
                isProfileEdited:false,
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
                userId: action.payload.userId,
                username: action.payload.username,
                email: action.payload.email,
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
                isPasswordChanged:false,
                isLoading:false,
                isPasswordReseted:false,
                isProfileEdited:false,
                token:'',
                username:'',
                email:'',
                error:false
            } as IAuthState;
        }

        case "SET_AUTH_CHANGE_PASSWORD_SUCCESS":{
            return {
                ...state,
                isPasswordChanged:true,
                error:false,
                messege:action.payload.messege,
                isLoading:false,
            } as IAuthState;
        }

        case "SET_AUTH_CHANGE_PASSWORD_FAILURE":{
            return {
                ...state,
                isPasswordChanged:false,
                error:true,
                messege:action.payload.messege,
                isLoading:false
            } as IAuthState;
        }

        case "SET_AUTH_EDIT_PROFILE_SUCCESS":{
            return {
                ...state,
                isProfileEdited:true,
                error:false,
                messege:action.payload.messege,
                isLoading:false,
                email:action.payload.email,
                username:action.payload.username
            } as IAuthState;
        }

        case "SET_AUTH_EDIT_PROFILE_FAILURE":{
            return {
                ...state,
                isProfileEdited:false,
                error:true,
                messege:action.payload.messege,
                isLoading:false,
            } as IAuthState;
        }

        case "SET_AUTH_RESET_FORGOTTEN_PASSWORD_SUCCESS":{
            return {
                ...state,
                isPasswordReseted:true,
                error:false,
                messege:action.payload.messege,
                isLoading:false,
            } as IAuthState;
        }
        
        case "SET_AUTH_RESET_FORGOTTEN_PASSWORD_FAILURE":{
            return {
                ...state,
                isPasswordReseted:false,
                error:true,
                messege:action.payload.messege,
                isLoading:false,
            } as IAuthState;
        }

        default: {
            return {...state};
        }
    }
}

export default authReducer;