import { AppActions } from './types/actions';
import { Dispatch } from 'react';
import IGenericResponse from '../types/response';
import { saveUserToDirect } from '../handlers/inbox';
import { DirectItem } from '../components/InboxView/InboxView';

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

export const CALL_FINISH_SEARCH_DIRECT = (results: Array<DirectItem>):AppActions => ({
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

export const CALL_HANDLE_DIRECT_SELECTION_SUCCESS = (message:string,direct:DirectItem):AppActions => ({
    type: 'SET_HANDLE_DIRECT_SELECTION_SUCCESS',
    payload: {
        message,
        direct
    }
});

export const CALL_ADD_INBOX_DIRECTS = (directs:Array<DirectItem>):AppActions => ({
    type: 'SET_ADD_INBOX_DIRECTS',
    payload: {
        directs
    }
});

export const CALL_SELECT_DIRECT_ITEM = (index:number,direct:DirectItem):AppActions => ({
    type: 'SET_SELECT_DIRECT_ITEM',
    payload: {
        index,
        direct
    }
});

export const CALL_HANDLE_DIRECT_SELECTION = (username:string,userId:string,token:string) => (dispatch:Dispatch<AppActions>) => {
    let promise:Promise<{direct:DirectItem} & IGenericResponse> = saveUserToDirect(username,userId,token);
        promise.then((res:{direct:DirectItem} & IGenericResponse) => {
            if(res.success){
                dispatch(CALL_HANDLE_DIRECT_SELECTION_SUCCESS(res.messege,res.direct));
            }
            else{
                dispatch(CALL_HANDLE_DIRECT_SELECTION_FAILURE(res.messege));
            }
        });
}

