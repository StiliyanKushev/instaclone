import { IPost } from './../shared/PostsPartial/PostsPartial';
import { postActionTypes } from "../actions/types/postActions";

export interface IPostState {
    error:boolean,
    messege:string,
    isPostLoading:boolean,
    isPostUploaded:boolean,
    homePosts:Array<IPost>,
}

const userState:IPostState = {
    error:false,
    messege:'',
    isPostLoading:false,
    isPostUploaded:false,
    homePosts:[],
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
                messege:action.payload.messege,
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

        case 'SET_POST_COMMENT_SUCCESS':{
            // add comment to ownComments
            state.homePosts[action.payload.postIndex].ownComments.push({content:action.payload.comment});
            
            return {
                ...state,
                error:false,
                isPostLoading:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_POST_COMMENT_FAILURE':{
            return {
                ...state,
                error:true,
                isPostLoading:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_POST_LIKE_SUCCESS':{
            if(!state.homePosts[action.payload.postIndex].isLiked){
                //change the value of specific index to increment
                state.homePosts[action.payload.postIndex].likesCount++;
            }
            else{
                //change the value of specific index to decrement
                state.homePosts[action.payload.postIndex].likesCount--;
            }

            // update the isliked value of the post
            state.homePosts[action.payload.postIndex].isLiked = !state.homePosts[action.payload.postIndex].isLiked;

            return {
                ...state,
                error:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_POST_LIKE_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege
            } as IPostState
        }

        case 'ADD_POSTS_HOME':{
            return {
                ...state,
                homePosts: [...state.homePosts, ...action.payload.posts]
            } as IPostState
        }

        default: {
            return {...state};
        }
    }
}

export default postReducer;