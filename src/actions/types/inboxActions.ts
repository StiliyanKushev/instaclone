const SET_TOGGLE_DIRECT = 'SET_TOGGLE_DIRECT';
const CLEAN_QUERY_DIRECT = 'CLEAN_QUERY_DIRECT';
const START_SEARCH_DIRECT = 'START_SEARCH_DIRECT';
const FINISH_SEARCH_DIRECT = 'FINISH_SEARCH_DIRECT';
const UPDATE_SELECTION_DIRECT = 'UPDATE_SELECTION_DIRECT';
const SET_HANDLE_DIRECT_SELECTION_FAILURE = 'SET_HANDLE_DIRECT_SELECTION_FAILURE';
const SET_HANDLE_DIRECT_SELECTION_SUCCESS = 'SET_HANDLE_DIRECT_SELECTION_SUCCESS';

export interface setToggleDirect {
    type: typeof SET_TOGGLE_DIRECT,
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
        message: string
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
        results: Array<{name:string}>, // array of usernames
    }    
}

export interface updateSelection {
    type: typeof UPDATE_SELECTION_DIRECT,
    payload: {
        selection: string,
    }    
}

export type inboxTypes = 
setHandleDirectSelectionSuccess |
setHandleDirectSelectionFailure |
setToggleDirect |
updateSelection |
finishSearch |
startSearch |
clearQuery;