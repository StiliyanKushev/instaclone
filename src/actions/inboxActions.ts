import { AppActions } from './types/actions';
import { Dispatch } from 'react';
import IGenericResponse from '../types/response';
import { saveUserToDirect, deleteUserFromDirect, saveMessageToDb, sendPrepareDataInbox } from '../handlers/inbox';
import { DirectItem } from '../components/InboxView/InboxView';
import { IMessage, IMessageDB } from '../types/response';

export const CALL_CONNECT_INBOX_SOCKET = (): AppActions => ({
    type: 'SET_CONNECT_INBOX_SOCKET',
});

export const CALL_CLEAR_MESSAGES = (): AppActions => ({
    type: 'SET_CLEAR_MESSAGES',
});

export const CALL_TOGGLE_DIRECT = (): AppActions => ({
    type: 'SET_TOGGLE_DIRECT',
});

export const CALL_CLEAN_QUERY_DIRECT = (): AppActions => ({
    type: 'CLEAN_QUERY_DIRECT',
});

export const CALL_START_SEARCH_DIRECT = (query: string): AppActions => ({
    type: 'START_SEARCH_DIRECT',
    payload: {
        query,
    }
});

export const CALL_PREPARE_INBOX = (username:string): AppActions => ({
    type: 'SET_PREPARE_INBOX',
    payload: {
        username
    }
});

export const CALL_FINISH_SEARCH_DIRECT = (results: Array<DirectItem>): AppActions => ({
    type: 'FINISH_SEARCH_DIRECT',
    payload: {
        results,
    }
})

export const CALL_UPDATE_SELECTION_DIRECT = (selection: string): AppActions => ({
    type: 'UPDATE_SELECTION_DIRECT',
    payload: {
        selection,
    }
})

export const CALL_HANDLE_DIRECT_SELECTION_FAILURE = (message: string): AppActions => ({
    type: 'SET_HANDLE_DIRECT_SELECTION_FAILURE',
    payload: {
        message
    }
});

export const CALL_HANDLE_DIRECT_SELECTION_SUCCESS = (message: string, direct: DirectItem): AppActions => ({
    type: 'SET_HANDLE_DIRECT_SELECTION_SUCCESS',
    payload: {
        message,
        direct
    }
});

export const CALL_ADD_INBOX_DIRECTS = (directs: Array<DirectItem>): AppActions => ({
    type: 'SET_ADD_INBOX_DIRECTS',
    payload: {
        directs
    }
});

export const CALL_SELECT_DIRECT_ITEM = (index: number, direct: DirectItem): AppActions => ({
    type: 'SET_SELECT_DIRECT_ITEM',
    payload: {
        index,
        direct
    }
});

export const CALL_DELETE_DIRECT_SUCCESS = (message: string): AppActions => ({
    type: 'SET_DELETE_DIRECT_SUCCESS',
    payload: {
        message
    }
});

export const CALL_DELETE_DIRECT_FAILURE = (message: string): AppActions => ({
    type: 'SET_DELETE_DIRECT_FAILURE',
    payload: {
        message
    }
});

export const DELETE_DIRECT_ITEM = (username: string, userId: string, token: string) => (dispatch: Dispatch<AppActions>) => {
    let promise: Promise<{ direct: DirectItem } & IGenericResponse> = deleteUserFromDirect(username, userId, token);
    promise.then((res: IGenericResponse) => {
        if (res.success) {
            dispatch(CALL_DELETE_DIRECT_SUCCESS(res.messege));
        }
        else {
            dispatch(CALL_DELETE_DIRECT_FAILURE(res.messege));
        }
    });
}

export const CALL_SEND_PREPARE_DATA_INBOX_SUCCESS = (message: string): AppActions => ({
    type: 'SET_SEND_PREPARE_DATA_INBOX_SUCCESS',
    payload: {
        message
    }
});

export const CALL_SEND_PREPARE_DATA_INBOX = (otherUsername: string, username:string, userId:string, token:string) => (dispatch: Dispatch<AppActions>) => {
    let promise: Promise<IGenericResponse> = sendPrepareDataInbox(otherUsername, username, userId, token);
    promise.then((res: IGenericResponse) => {
        if (res.success) {
            dispatch(CALL_SEND_PREPARE_DATA_INBOX_SUCCESS(res.messege));
        }
        else {
            // internal error
            console.log(res.messege);
        }
    });
}

export const CALL_INPUT_MESSAGE = (message: string): AppActions => ({
    type: 'SET_INPUT_MESSAGE',
    payload: {
        message
    }
});

export const CALL_ADD_MESSAGES_MESSAGE = (message: IMessage): AppActions => ({
    type: 'ADD_MESSAGES_MESSAGE',
    payload: {
        message
    }
});

export const CALL_ADD_MESSAGES_INBOX = (messages: Array<IMessageDB>): AppActions => ({
    type: 'ADD_MESSAGES_INBOX',
    payload: {
        messages
    }
});

export const CALL_HANDLE_DIRECT_SELECTION = (username: string, userId: string, token: string) => (dispatch: Dispatch<AppActions>) => {
    let promise: Promise<{ direct: DirectItem } & IGenericResponse> = saveUserToDirect(username, userId, token);
    promise.then((res: { direct: DirectItem } & IGenericResponse) => {
        if (res.success) {
            dispatch(CALL_HANDLE_DIRECT_SELECTION_SUCCESS(res.messege, res.direct));
        }
        else {
            dispatch(CALL_HANDLE_DIRECT_SELECTION_FAILURE(res.messege));
        }
    });
}

export const SAVE_MESSAGE_DB = (msg: IMessageDB, userId: string, token: string) => (dispatch: Dispatch<AppActions>) => {
    saveMessageToDb(msg, userId, token);
}