import { AppActions } from './types/actions';
import { Dispatch } from 'react';
import IGenericResponse from '../types/response';
import { saveUserToDirect } from '../handlers/inbox';

export const CALL_TOGGLE_DIRECT = ():AppActions => ({
    type: 'SET_TOGGLE_DIRECT',
});

export const CALL_CLEAN_QUERY_DIRECT = ():AppActions => ({
    type: 'CLEAN_QUERY_DIRECT',
})

export const CALL_START_SEARCH_DIRECT = (query:string):AppActions => ({
    type: 'START_SEARCH_DIRECT',
    payload: {
        query,
    }   
})

export const CALL_FINISH_SEARCH_DIRECT = (results: Array<{name:string}>):AppActions => ({
    type: 'FINISH_SEARCH_DIRECT',
    payload: {
        results,
    } 
})

export const CALL_UPDATE_SELECTION_DIRECT = (selection:string):AppActions => ({
    type: 'UPDATE_SELECTION_DIRECT',
    payload: {
        selection,
    }  
})

export const CALL_HANDLE_DIRECT_SELECTION_FAILURE = (message:string):AppActions => ({
    type: 'SET_HANDLE_DIRECT_SELECTION_FAILURE',
    payload: {
        message
    }
});

export const CALL_HANDLE_DIRECT_SELECTION_SUCCESS = (message:string):AppActions => ({
    type: 'SET_HANDLE_DIRECT_SELECTION_SUCCESS',
    payload: {
        message
    }
});

export const CALL_HANDLE_DIRECT_SELECTION = (username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    let promise:Promise<IGenericResponse> = saveUserToDirect(username,userId,token);
        promise.then((res:IGenericResponse) => {
            if(res.success){
                dispatch(CALL_HANDLE_DIRECT_SELECTION_SUCCESS(res.messege));
            }
            else{
                dispatch(CALL_HANDLE_DIRECT_SELECTION_FAILURE(res.messege));
            }
        });
}