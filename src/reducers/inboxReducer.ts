import { inboxTypes } from '../actions/types/inboxActions';
import { DirectItem } from '../components/InboxView/InboxView';
import { IMessage } from '../types/response';

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

    messages: Array<IMessage>,
    inputMessage: string,
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

    messages: [],
    inputMessage: '',
}

const inboxReducer = (state = inboxState, action:inboxTypes) => {
    switch (action.type) {
        case "SET_INPUT_MESSAGE":{
            return {
                ...state,
                inputMessage: action.payload.message,
            } as IInboxState
        }

        case "ADD_MESSAGES_INBOX":{
            let converted:Array<IMessage> = [];

            for(let msg of action.payload.messages){
                converted.push({
                    user: msg.author,
                    text: msg.text,
                })
            }

            let reversed = converted.reverse();

            return {
                ...state,
                messages:[...reversed,...state.messages]
            } as IInboxState
        }

        case "ADD_MESSAGES_MESSAGE":{
            return {
                ...state,
                messages:[...state.messages, action.payload.message]
            } as IInboxState
        }

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

        case 'SET_DELETE_DIRECT_SUCCESS':{
            state.directs.splice(state.directCurrentIndex,1);
            return {
                ...state,
                directCurrentIndex:-1,
                currentUsername:'',
                currentUserId:'',
                currentDirectItemId:'',
                error:false,
                message: action.payload.message
            } as IInboxState
        }

        case 'SET_DELETE_DIRECT_FAILURE':{
            return {
                ...state,
                error:true,
                message: action.payload.message
            } as IInboxState
        }

        default:
            return {...state} as IInboxState
    }
}

export default inboxReducer;