import { postActionTypes } from '../actions/types/postActions';
import {
    IOtherPost,
    IPost,
    IPostComment,
} from '../shared/PostsPartial/PostsPartial';

export type IFullViewPostCommentList = Array<IPostComment & {isDescription?:boolean}>;
export type IFullViewPostData = IPost & {commentsList:IFullViewPostCommentList};
export type IPostsListGrid = [{
    likesCount:number,
    source:{
        data:any,
        contentType:string,
    },
    _id:string,
}]

export interface IPostState {
    error:boolean,
    messege:string,
    isPostLoading:boolean,
    isPostUploaded:boolean,
    homePosts:Array<IPost>,
    fullViewToggled:boolean,
    isOtherPostDataLoading:boolean,
    fullViewPostData:IFullViewPostData,
    fullViewPostIndex:number,
    currentReplyingComment:number,
    currentReplyingSubComment:number,
    currentExplorerGrid:Array<Array<IOtherPost>>,
    didJustReplyToComment:boolean,
    fullViewOtherPosts: IPostsListGrid,
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
    isSaved:false,
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
    isOtherPostDataLoading:false,
    fullViewPostData: emptyFullViewPostData,
    fullViewPostIndex: -1,
    currentReplyingComment: -1,
    currentReplyingSubComment: -1,
    didJustReplyToComment: false,
    fullViewOtherPosts: [] as any,
    currentExplorerGrid: [] as any,
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
            action.payload.comment.moreToggled = false;
            
            // add comment to ownComments
            if((action.payload.comment.parentComment === undefined) || (action.payload.comment.parentComment && action.payload.comment.parentComment.length === 0)){
                state.homePosts[action.payload.postIndex].ownComments.push(action.payload.comment);
            }

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

        case 'SET_COMMENT_LIKE_SUCCESS':{
            // if it's a regular comment and not a sub comment
            if(action.payload.subCommentIndex === undefined){
                if(!state.fullViewPostData.commentsList[action.payload.commentIndex].isLiked){
                    // change the value of specific index to increment
                    state.fullViewPostData.commentsList[action.payload.commentIndex].likesCount++;
                }
                else{
                    // change the value of specific index to decrement
                    state.fullViewPostData.commentsList[action.payload.commentIndex].likesCount--;
                }
    
                // update the isliked value of the comment
                state.fullViewPostData.commentsList[action.payload.commentIndex].isLiked = !state.fullViewPostData.commentsList[action.payload.commentIndex].isLiked;
            }
            // else if it's a sub comment
            else{
                if(!((state.fullViewPostData.commentsList[action.payload.commentIndex].subComments)as any)[action.payload.subCommentIndex].isLiked){
                    // change the value of specific index to increment
                    ((state.fullViewPostData.commentsList[action.payload.commentIndex].subComments)as any)[action.payload.subCommentIndex].likesCount++;
                }
                else{
                    // change the value of specific index to decrement
                    ((state.fullViewPostData.commentsList[action.payload.commentIndex].subComments)as any)[action.payload.subCommentIndex].likesCount--;
                }
    
                // update the isliked value of the comment
                ((state.fullViewPostData.commentsList[action.payload.commentIndex].subComments)as any)[action.payload.subCommentIndex].isLiked = !((state.fullViewPostData.commentsList[action.payload.commentIndex].subComments)as any)[action.payload.subCommentIndex].isLiked;
            }

            return {
                ...state,
                error:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_COMMENT_LIKE_FAILURE':{
            return {
                ...state,
                error:true,
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

        case 'SET_POST_SAVE_SUCCESS':{
            // update the isliked value of the post
            state.homePosts[action.payload.postIndex].isSaved = !state.homePosts[action.payload.postIndex].isSaved;

            return {
                ...state,
                error:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_POST_SAVE_FAILURE':{
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
            for(let c of action.payload.comments){
                c.moreToggled = false;
            }

            state.fullViewPostData.commentsList = [...state.fullViewPostData.commentsList,...action.payload.comments]

            return {
                ...state,
            } as IPostState
        }

        case 'SET_TOGGLE_FULL_POST_VIEW':{
            if(state.fullViewToggled){
                state.currentReplyingComment = -1;

                // close expanded replies from sub comments
                for(let parentComment of state.fullViewPostData.commentsList){
                    parentComment.childCommentsNumber = parentComment.maxChildCommentsNumber;
                    parentComment.moreToggled = false;
                    parentComment.subComments = [] as any;
                }

                state.fullViewPostData = emptyFullViewPostData;
            }

            return {
                ...state,
                fullViewToggled: !state.fullViewToggled,
                fullViewPostIndex: action.payload.postIndex !== -1 ? action.payload.postIndex : state.fullViewPostIndex
            } as IPostState
        }

        case 'SET_FULL_POST_DATA_VIEW':{
            for(let c of action.payload.postData.ownComments) c.moreToggled = false;
            for(let c of action.payload.postData.comments) c.moreToggled = false;

            let list:IFullViewPostCommentList = [
                {
                    isDescription: true,
                    content: action.payload.postData.description,
                    creator: action.payload.postData.creator,
                } as any,
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
            // :ugly: loop the home view posts and update the one with correct id
            const homeAction = (like: boolean) => {
                if (action.payload.id && state.homePosts && state.homePosts.length > 0)
                    for (let i = 0; i < state.homePosts.length; i++) {
                        if (state.homePosts[i]._id === action.payload.id) {
                            state.homePosts[i].isLiked = like;
                            state.homePosts[i].likesCount += like ? 1 : -1;
                            break;
                        }
                    }
            }

            if(action.payload.didFetch === true){
                if(!state.fullViewPostData.isLiked){
                    // change the value of specific index to increment
                    state.fullViewPostData.likesCount++;
                    homeAction(true)
                }
                else{
                    // change the value of specific index to decrement
                    state.fullViewPostData.likesCount--;
                    homeAction(false)
                }
    
                // update the isliked value of the post
                state.fullViewPostData.isLiked = !state.fullViewPostData.isLiked;
            }

            return {
                ...state,
                error:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FULL_POST_LIKE_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FULL_POST_SAVE_SUCCESS':{
            // :ugly: loop the home view posts and update the one with correct id
            const homeAction = (save: boolean) => {
                if (action.payload.id && state.homePosts && state.homePosts.length > 0)
                    for (let i = 0; i < state.homePosts.length; i++) {
                        if (state.homePosts[i]._id === action.payload.id) {
                            state.homePosts[i].isSaved = save;
                            break;
                        }
                    }
            }

            if(action.payload.didFetch === true){    
                // update the isSaved value of the post
                state.fullViewPostData.isSaved = !state.fullViewPostData.isSaved;
                homeAction(state.fullViewPostData.isSaved);
            }

            return {
                ...state,
                error:false,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FULL_POST_SAVE_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege
            } as IPostState
        }

        case 'SET_FULL_POST_COMMENT_SUCCESS':{
            action.payload.comment.moreToggled = false;
            // add comment to the end of the list if its not a relpy
            if(state.currentReplyingComment === -1)
                state.fullViewPostData.commentsList.splice(state.fullViewPostData.commentsList.length, 0,action.payload.comment);
            else {
                state.didJustReplyToComment = true;

                // increment the parent comment replies counter
                state.fullViewPostData.commentsList[state.currentReplyingComment].maxChildCommentsNumber++;

                if(state.fullViewPostData.commentsList[state.currentReplyingComment].subComments)
                state.fullViewPostData.commentsList[state.currentReplyingComment].subComments?.push(action.payload.comment);
                else state.fullViewPostData.commentsList[state.currentReplyingComment].subComments = [action.payload.comment];

                state.fullViewPostData.commentsList[state.currentReplyingComment].moreToggled = true;

                // at the end reset this after replying
                state.currentReplyingComment = -1;
            }

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

        case 'SET_REPLYING_COMMENT':{
            return {
                ...state,
                currentReplyingComment: action.payload.commentIndex,
                currentReplyingSubComment: action.payload.subCommentIndex
            } as IPostState
        }

        case 'SET_TOGGLE_MORE_COMMENT':{
            if(state.didJustReplyToComment) state.didJustReplyToComment = false;

            state.fullViewPostData.commentsList[action.payload.commentIndex].childCommentsNumber -= 5;
            if(state.fullViewPostData.commentsList[action.payload.commentIndex].childCommentsNumber < 0){
                state.fullViewPostData.commentsList[action.payload.commentIndex].childCommentsNumber = 0;
            }

            if(!state.fullViewPostData.commentsList[action.payload.commentIndex].moreToggled || (state.fullViewPostData.commentsList[action.payload.commentIndex].moreToggled && action.payload.comments !== undefined)){
                state.fullViewPostData.commentsList[action.payload.commentIndex].moreToggled = true;
                state.fullViewPostData.commentsList[action.payload.commentIndex].subComments = action.payload.comments;
            }
            else if(state.fullViewPostData.commentsList[action.payload.commentIndex].moreToggled && state.fullViewPostData.commentsList[action.payload.commentIndex].childCommentsNumber === 0 && action.payload.comments === undefined){
                state.fullViewPostData.commentsList[action.payload.commentIndex].moreToggled = false;
                state.fullViewPostData.commentsList[action.payload.commentIndex].childCommentsNumber = state.fullViewPostData.commentsList[action.payload.commentIndex].maxChildCommentsNumber;
                state.fullViewPostData.commentsList[action.payload.commentIndex].subComments = [] as any;
            }

            return {
                ...state,
                messege: "Toggled more for comment"
            } as IPostState
        }

        case 'SET_OTHER_POST_DATA_LOADING':{
            return {
                ...state,
                isOtherPostDataLoading:true
            } as IPostState
        }

        case 'SET_OTHER_POST_DATA_LOADING_DONE':{
            return {
                ...state,
                isOtherPostDataLoading:false
            } as IPostState
        }

        case 'SET_SAVE_OTHER_POSTS':{
            return {
                ...state,
                fullViewOtherPosts:action.payload.posts
            } as IPostState
        }

        case 'SET_RENEW_OTHER_POSTS':{
            if(action.payload.post)
            state.fullViewOtherPosts[action.payload.index] = action.payload.post;
            else{
                state.fullViewOtherPosts.splice(action.payload.index,1);
            }

            return {
                ...state,
            } as IPostState
        }

        case 'RESET_POST_UPLOADED':{
            return {
                ...state,
                isPostUploaded: false
            } as IPostState
        }

        case 'ADD_EXPLORER_POSTS_ROW_LIST':{
            for(let row of action.payload.posts){
                state.currentExplorerGrid.push(row)
            }
            return {
                ...state,
            } as IPostState
        }

        case 'SET_POST_DELETE_SUCCESS':{
            if(action.payload.postIndex !== -1)
            state.homePosts.splice(action.payload.postIndex,1);
            
            // else we are calling it from post article (then just redirect)
            if(action.payload.postIndex === -1 && state.fullViewPostIndex !== -1){
                if(state.fullViewToggled){
                    state.currentReplyingComment = -1;
    
                    // close expanded replies from sub comments
                    for(let parentComment of state.fullViewPostData.commentsList){
                        parentComment.childCommentsNumber = parentComment.maxChildCommentsNumber;
                        parentComment.moreToggled = false;
                        parentComment.subComments = [] as any;
                    }
    
                    state.fullViewPostData = emptyFullViewPostData;
                }
    
                state.fullViewToggled = !state.fullViewToggled
                state.fullViewPostIndex = -1
            }

            return {
                ...state,
                error: false,
                messege: action.payload.messege,
            } as IPostState
        }

        case 'SET_POST_DELETE_FAILURE':{
            return {
                ...state,
                messege: action.payload.messege,
                error: true,
            } as IPostState
        }

        default: {
            return {...state};
        }
    }
}

export default postReducer;