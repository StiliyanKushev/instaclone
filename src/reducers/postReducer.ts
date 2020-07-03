import { postActionTypes } from "../actions/types/postActions";

export interface IPostState {
    error:boolean,
    messege:string,
    isPostLoading:boolean,
    isPostUploaded:boolean,
}

const userState:IPostState = {
    error:false,
    messege:'',
    isPostLoading:false,
    isPostUploaded:false,
}

const postReducer = (state = userState, action:postActionTypes) => {
    switch (action.type) {
        case 'SET_POST_LOADING':{
            return {
                ...state,
                error:false,
                isPostLoading:true,
                isPostUploaded:false,
            } as IPostState;
        }

        case 'SET_POST_UPLOAD_SUCCESS':{
            return {
                ...state,
                error:false,
                isPostLoading:false,
                isPostUploaded:true,
                messege:action.payload.messege
            } as IPostState;
        }

        case 'SET_POST_UPLOAD_FAILURE':{
            return {
                ...state,
                error:true,
                isPostLoading:false,
                isPostUploaded:false,
                messege:action.payload.messege
            } as IPostState;
        }

        default: {
            return {...state};
        }
    }
}

export default postReducer;