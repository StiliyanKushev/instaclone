import { DirectItem } from '../../components/InboxView/InboxView';
import { IMessage, IMessageDB } from '../../types/response';
const SET_TOGGLE_DIRECT = 'SET_TOGGLE_DIRECT';
const CLEAN_QUERY_DIRECT = 'CLEAN_QUERY_DIRECT';
const START_SEARCH_DIRECT = 'START_SEARCH_DIRECT';
const FINISH_SEARCH_DIRECT = 'FINISH_SEARCH_DIRECT';
const UPDATE_SELECTION_DIRECT = 'UPDATE_SELECTION_DIRECT';
const SET_HANDLE_DIRECT_SELECTION_FAILURE = 'SET_HANDLE_DIRECT_SELECTION_FAILURE';
const SET_HANDLE_DIRECT_SELECTION_SUCCESS = 'SET_HANDLE_DIRECT_SELECTION_SUCCESS';
const SET_ADD_INBOX_DIRECTS = 'SET_ADD_INBOX_DIRECTS';
const SET_SELECT_DIRECT_ITEM = 'SET_SELECT_DIRECT_ITEM';
const SET_DELETE_DIRECT_SUCCESS = 'SET_DELETE_DIRECT_SUCCESS';
const SET_DELETE_DIRECT_FAILURE = 'SET_DELETE_DIRECT_FAILURE';
const ADD_MESSAGES_MESSAGE = 'ADD_MESSAGES_MESSAGE';
const SET_INPUT_MESSAGE = 'SET_INPUT_MESSAGE';
const ADD_MESSAGES_INBOX = 'ADD_MESSAGES_INBOX';
const SET_CONNECT_INBOX_SOCKET = 'SET_CONNECT_INBOX_SOCKET';
const SET_CLEAR_MESSAGES = 'SET_CLEAR_MESSAGES';
const SET_PREPARE_INBOX = 'SET_PREPARE_INBOX';
const SET_SEND_PREPARE_DATA_INBOX = 'SET_SEND_PREPARE_DATA_INBOX';
const SET_SEND_PREPARE_DATA_INBOX_SUCCESS = 'SET_SEND_PREPARE_DATA_INBOX_SUCCESS';

export interface setToggleDirect {
    type: typeof SET_TOGGLE_DIRECT,
}

export interface setDeleteDirectSuccess {
    type: typeof SET_DELETE_DIRECT_SUCCESS,
    payload: {
        message: string
    }
}

export interface setDeleteDirectFailure {
    type: typeof SET_DELETE_DIRECT_FAILURE,
    payload: {
        message: string
    }
}

export interface setAddInboxDirects {
    type: typeof SET_ADD_INBOX_DIRECTS,
    payload: {
        directs: Array<DirectItem>
    }
}

export interface setHandleDirectSelectionFailure {
    type: typeof SET_HANDLE_DIRECT_SELECTION_FAILURE,
    payload: {
        message: string
    }
}
export interface setHandleDirectSelectionSuccess {
    type: typeof SET_HANDLE_DIRECT_SELECTION_SUCCESS,
    payload: {
        message: string,
        direct: DirectItem
    }
}

export interface setSendPrepareDataInboxSuccess {
    type: typeof SET_SEND_PREPARE_DATA_INBOX_SUCCESS,
    payload: {
        message: string,
    }
}

export interface setSelectDirectItem {
    type: typeof SET_SELECT_DIRECT_ITEM,
    payload: {
        direct: DirectItem,
        index: number,
    }
}

export interface clearQuery {
    type: typeof CLEAN_QUERY_DIRECT,
}

export interface startSearch {
    type: typeof START_SEARCH_DIRECT,
    payload: {
        query: string,
    }    
}

export interface finishSearch {
    type: typeof FINISH_SEARCH_DIRECT,
    payload: {
        results: Array<DirectItem>, // array of usernames
    }    
}

export interface updateSelection {
    type: typeof UPDATE_SELECTION_DIRECT,
    payload: {
        selection: string,
    }    
}

export type setInputMessage = {
    type: typeof SET_INPUT_MESSAGE,
    payload: {
        message: string,
    }
}

export type addMessagesMsg = {
    type: typeof ADD_MESSAGES_MESSAGE,
    payload: {
        message: IMessage,
    }
}

export type addMessagesInbox = {
    type: typeof ADD_MESSAGES_INBOX,
    payload: {
        messages: Array<IMessageDB>,
    }
}

export type connectSocket = {
    type: typeof SET_CONNECT_INBOX_SOCKET,
}

export type clearMessages = {
    type: typeof SET_CLEAR_MESSAGES,
}

export type prepareInbox = {
    type: typeof SET_PREPARE_INBOX,
    payload: {
        username: string,
    }
}

export type sendPrepareDataInbox = {
    type: typeof SET_SEND_PREPARE_DATA_INBOX,
}

export type inboxTypes = 
prepareInbox |
setInputMessage |
clearMessages |
connectSocket |
addMessagesMsg |
addMessagesInbox |
setHandleDirectSelectionSuccess |
setHandleDirectSelectionFailure |
setSendPrepareDataInboxSuccess |
sendPrepareDataInbox |
setDeleteDirectSuccess |
setDeleteDirectFailure |
setSelectDirectItem |
setAddInboxDirects |
setToggleDirect |
updateSelection |
finishSearch |
startSearch |
clearQuery;