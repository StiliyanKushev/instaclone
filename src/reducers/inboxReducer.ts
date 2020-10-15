import { inboxTypes } from '../actions/types/inboxActions';

export interface IInboxState {
    toggledDirect: boolean,
    loading: boolean,
    results: Array<{name:string}>,
    value: string,
}

const inboxState:IInboxState = {
    toggledDirect: false,
    loading: false,
    results: [],
    value: '',
}

const inboxReducer = (state = inboxState, action:inboxTypes) => {
    switch (action.type) {

        case "SET_TOGGLE_DIRECT":{
            return {
                ...state,
                toggledDirect: !state.toggledDirect
            } as IInboxState
        }

        case 'CLEAN_QUERY_DIRECT':{
            return {
                ...state,
                loading: false,
                results: [],
                value: '',
            } as IInboxState
        }

        case 'START_SEARCH_DIRECT':{
            return {
                ...state,
                loading: true,
                value: action.payload.query
            } as IInboxState
        }

        case 'FINISH_SEARCH_DIRECT':{
            return {
                ...state,
                loading: false,
                results: action.payload.results
            } as IInboxState
        }

        case 'UPDATE_SELECTION_DIRECT':{
            return {
                ...state,
                value: action.payload.selection
            } as IInboxState
        }

        default:
            return {...state} as IInboxState
    }
}

export default inboxReducer;