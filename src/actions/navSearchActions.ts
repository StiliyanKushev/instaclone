import { AppActions } from './types/actions';

export const CALL_CLEAN_QUERY = ():AppActions => ({
    type: 'CLEAN_QUERY',
})

export const CALL_START_SEARCH = (query:string):AppActions => ({
    type: 'START_SEARCH',
    payload: {
        query,
    }   
})

export const CALL_FINISH_SEARCH = (results: Array<{name:string}>):AppActions => ({
    type: 'FINISH_SEARCH',
    payload: {
        results,
    } 
})

export const CALL_UPDATE_SELECTION = (selection:string):AppActions => ({
    type: 'UPDATE_SELECTION',
    payload: {
        selection,
    }  
})