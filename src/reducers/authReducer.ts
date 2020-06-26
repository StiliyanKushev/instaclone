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

//TODO check if data is in cookies and fill it instead of using undefined
const authState:IAuthState = {
    isAuthFinished:false,
    isLogged:cookies.get('isLogged') || '',
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
                isLoading:true,
                isLogged:false,
                error:false,
            } as IAuthState;
        }

        case "SET_AUTH_FAILURE": {
            return {
                isLoading:false,
                isLogged:false,
                error:true,
                messege:action.payload.messege
            } as IAuthState;
        }

        case "SET_AUTH_SUCCESS": {
            return { 
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
                isAuthFinished:true,
                isLogged: true,
                username: state.username,
                token: state.token
            } as IAuthState;
        }

        default: {
            return {...state};
        }
    }
}

export default authReducer;