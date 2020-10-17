import { DirectItem } from '../../components/InboxView/InboxView';
const CLEAN_QUERY = 'CLEAN_QUERY';
const START_SEARCH = 'START_SEARCH';
const FINISH_SEARCH = 'FINISH_SEARCH';
const UPDATE_SELECTION = 'UPDATE_SELECTION';

export interface clearQuery {
    type: typeof CLEAN_QUERY,
}

export interface startSearch {
    type: typeof START_SEARCH,
    payload: {
        query: string,
    }    
}

export interface finishSearch {
    type: typeof FINISH_SEARCH,
    payload: {
        results: Array<{name:string}>, // array of usernames
    }    
}

export interface updateSelection {
    type: typeof UPDATE_SELECTION,
    payload: {
        selection: string,
    }    
}

export type navSearchTypes = 
updateSelection |
finishSearch |
startSearch |
clearQuery;