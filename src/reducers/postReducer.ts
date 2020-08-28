import { IPost, IPostComment } from './../shared/PostsPartial/PostsPartial';
import { postActionTypes } from "../actions/types/postActions";

export type IFullViewPostCommentList = Array<IPostComment & {isDescription?:boolean}>;
export type IFullViewPostData = IPost & {commentsList:IFullViewPostCommentList};

export interface IPostState {
    error:boolean,
    messege:string,
    isPostLoading:boolean,
    isPostUploaded:boolean,
    homePosts:Array<IPost>,
    fullViewToggled:boolean,
    fullViewPostData:IFullViewPostData,
    fullViewPostIndex:number,
}

// doing this so there are no run time errors on inital render (before setting the data in the componentDidMount in some cases)
const emptyFullViewPostData: IFullViewPostData = {
    postIndex:0,
    creator:{
        id:'',
        username:'',
    },
    description:'',
    _id:'',
    isLiked:false,
    likesCount:0,
    source:{
        contentType:'',
        data:'',
    },
    comments:[],
    ownComments:[],
    commentsList:[],
};

const postState:IPostState = {
    error:false,
    messege:'',
    isPostLoading:false,
    isPostUploaded:false,
    homePosts:[],
    fullViewToggled:false,
    fullViewPostData: emptyFullViewPostData,
    fullViewPostIndex: -1,
}

const postReducer = (state = postState, action:postActionTypes) => {
    switch (action.type) {
        case 'SET_POST_CLEAR':{
            return {
                ...postState
            } as IPostState;
        }

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
                // change the value of specific index to increment
                state.homePosts[action.payload.postIndex].likesCount++;
            }
            else{
                // change the value of specific index to decrement
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

        case 'ADD_COMMENTS_POST':{
            state.fullViewPostData.commentsList = [...state.fullViewPostData.commentsList,...action.payload.comments]

            return {
                ...state,
            } as IPostState
        }

        case 'SET_TOGGLE_FULL_POST_VIEW':{
            return {
                ...state,
                fullViewToggled: !state.fullViewToggled,
                fullViewPostIndex: action.payload.postIndex !== -1 ? action.payload.postIndex : state.fullViewPostIndex
            } as IPostState
        }

        case 'SET_FULL_POST_DATA_VIEW':{
            let list:IFullViewPostCommentList = [
                {
                    isDescription: true,
                    content: action.payload.postData.description,
                    creator: action.payload.postData.creator,
                },
                ...action.payload.postData.ownComments,
                ...action.payload.postData.comments,
            ];

            let newData:IFullViewPostData = action.payload.postData as IFullViewPostData;
            newData.commentsList = list;

            return {
                ...state,
                fullViewPostData: newData
            } as IPostState
        }

        case 'SET_FULL_POST_LIKE_SUCCESS':{
            return {
                ...state,
                error:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FULL_POST_LIKE_FAILURE':{
            if(!state.fullViewPostData.isLiked){
                // change the value of specific index to increment
                state.fullViewPostData.likesCount++;
            }
            else{
                // change the value of specific index to decrement
                state.fullViewPostData.likesCount--;
            }

            // update the isliked value of the post
            state.fullViewPostData.isLiked = !state.fullViewPostData.isLiked;

            return {
                ...state,
                error:true,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FULL_POST_COMMENT_SUCCESS':{
            // add comment to the start of the list (after the description)
            state.fullViewPostData.commentsList.splice(1, 0,{creator:action.payload.creator,content:action.payload.comment} as IPostComment);

            return {
                ...state,
                error:false,
                isPostLoading:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FULL_POST_COMMENT_FAILURE':{
            return {
                ...state,
                error:true,
                isPostLoading:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FIX_POST_AFTER_UPDATE':{
            for(let item of action.payload.arr){
                state.homePosts[item.index] = item.post;
            }

            return {
                ...state,
            } as IPostState
        }

        default: {
            return {...state};
        }
    }
}

export default postReducer;