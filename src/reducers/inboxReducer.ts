import { inboxTypes } from '../actions/types/inboxActions';
import { DirectItem } from '../components/InboxView/InboxView';

export interface IInboxState {
    toggledDirect: boolean,
    loading: boolean,
    error:boolean,
    message:string,
    results: Array<DirectItem>,
    value: string,
    directs:Array<DirectItem>,
    directCurrentIndex:number,

    currentUsername:string,
    currentUserId:string,
    currentDirectItemId:string,
}

const inboxState:IInboxState = {
    toggledDirect: false,
    message:'',
    loading: false,
    value: '',
    results: [],
    directs: [],
    error: false,
    directCurrentIndex:-1,

    currentUsername:'',
    currentUserId:'',
    currentDirectItemId:'',
}

const inboxReducer = (state = inboxState, action:inboxTypes) => {
    switch (action.type) {
        case "SET_SELECT_DIRECT_ITEM":{
            state.directs[action.payload.index].isCurrent = true;
            if(state.directCurrentIndex !== -1)
            state.directs[state.directCurrentIndex].isCurrent = false;
            state.directCurrentIndex = action.payload.index;
            return { 
                ...state,
                currentUsername: action.payload.direct.name,
                currentUserId: action.payload.direct.userId,
                currentDirectItemId: action.payload.direct._id,
            } as IInboxState
        }

        case "SET_HANDLE_DIRECT_SELECTION_SUCCESS": {
            state.directs = [action.payload.direct,...state.directs]
            return {
                ...state,
                error:false,
                message: action.payload.message,
            } as IInboxState
        }

        case "SET_HANDLE_DIRECT_SELECTION_FAILURE": {
            return {
                ...state,
                error: true,
                message: action.payload.message
            } as IInboxState
        }

        case "SET_ADD_INBOX_DIRECTS": {
            return {
                ...state,
                directs: [...state.directs,...action.payload.directs]
            } as IInboxState
        }

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