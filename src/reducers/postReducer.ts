import { IPost } from './../shared/PostsPartial/PostsPartial';
import { postActionTypes } from "../actions/types/postActions";

export interface IPostState {
    error:boolean,
    messege:string,
    isPostLoading:boolean,
    isPostUploaded:boolean,
    homePosts:Array<IPost>,
    latestIndex:number,
}

const userState:IPostState = {
    error:false,
    messege:'',
    isPostLoading:false,
    isPostUploaded:false,
    homePosts:[],
    latestIndex:0, 
    // A post will fetch this and save it when loaded.
    // Then it will be incremented and be ready for the next post.
    // This way the post component knows it's index and we can create this 2 way connection,
    // between the component and the redux store.
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

        case 'SET_POST_INDEX_INCREMENT':{
            return {
                ...state,
                latestIndex: state.latestIndex + 1,
            } as IPostState
        }

        default: {
            return {...state};
        }
    }
}

export default postReducer;