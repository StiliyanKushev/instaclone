import { navSearchTypes } from '../actions/types/navSearchActions';
export interface INavSearchState {
    loading: boolean,
    results: Array<{name:string}>,
    value: string,
}

const navSearchState:INavSearchState = {
    loading:false,
    results: [],
    value: '',
}

const navSearchReducer = (state = navSearchState, action:navSearchTypes) => {
    switch (action.type) {

        case 'CLEAN_QUERY':{
            return {
                ...navSearchState
            } as INavSearchState
        }

        case 'START_SEARCH':{
            return {
                ...state,
                loading: true,
                value: action.payload.query
            } as INavSearchState
        }

        case 'FINISH_SEARCH':{
            return {
                ...state,
                loading: false,
                results: action.payload.results
            } as INavSearchState
        }

        case 'UPDATE_SELECTION':{
            return {
                ...state,
                value: action.payload.selection
            } as INavSearchState
        }

        default:
            return {...state} as INavSearchState
    }
}

export default navSearchReducer;