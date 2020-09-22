import { userActionTypes } from "../actions/types/userActions";
import { ICreator } from '../types/auth';
import IGenericResponse from '../types/response';
import { IPostsListGrid } from './postReducer';
import { IOtherPost } from '../shared/PostsPartial/PostsPartial';

export interface IUserState {
    error:boolean,
    messege:string,
    isUserLoading:boolean,
    isUserAvatarUpdated:boolean,
    suggestedUsers:Array<ICreator>,
    usersList:Array<ICreator>,
    usersListToggled:boolean,
    currentPostSelectionFunction: (startIndex:number,stopIndex:number) => Promise<IGenericResponse & {posts:IPostsListGrid}>
    currentUsersFetchFunction: (startIndex:number,stopIndex:number) => Promise<IGenericResponse & {likes:Array<ICreator>}>
    currentPostSelectionList: Array<Array<IOtherPost>>,
    isCurrentUserFollowed: boolean,
    isCurrentUserFollowLoading:boolean,
    currentUserPostsNum:number,
    currentUserFollowersNum:number,
    currentUserFollowingNum:number,
}

const userState:IUserState = {
    error:false,
    messege:'',
    isUserLoading:false,
    isUserAvatarUpdated:false,
    suggestedUsers:[] as any,
    usersList:[] as any,
    usersListToggled: false,
    currentUsersFetchFunction: (startIndex:number,stopIndex:number) => (1 as any),
    currentPostSelectionFunction: (startIndex:number,stopIndex:number) => (new Promise<any>(() => {}) as any),
    currentPostSelectionList: [] as any,
    isCurrentUserFollowed: false,
    isCurrentUserFollowLoading:false,
    currentUserPostsNum:0,
    currentUserFollowersNum:0,
    currentUserFollowingNum:0,
}

const userReducer = (state = userState, action:userActionTypes) => {
    switch (action.type) {
        case 'SET_USER_LOADING':{
            return {
                ...state,
                error:false,
                isUserLoading:true,
                isUserAvatarUpdated:false,
            } as IUserState;
        }

        case 'SET_USER_UPDATE_AVATER_SUCCESS':{
            return {
                ...state,
                error:false,
                isUserLoading:false,
                isUserAvatarUpdated:true,
                messege:action.payload.messege,
            } as IUserState;
        }

        case 'SET_USER_UPDATE_AVATER_FAILURE':{
            return {
                ...state,
                error:true,
                isUserLoading:false,
                isUserAvatarUpdated:false,
                messege:action.payload.messege
            } as IUserState;
        }

        case 'GET_SUGGESTED_USERS_SUCCESS':{
            return {
                ...state,
                suggestedUsers: action.payload.users,
                error: false,
                messege: action.payload.messege,
            } as IUserState
        }

        case 'GET_SUGGESTED_USERS_FAILURE':{
            return {
                error: true,
                messege: action.payload.messege
            } as IUserState
        }

        case 'SET_TOGGLE_USERS_LIST':{
            if(state.usersListToggled)
            state.usersList = []

            return {
                ...state,
                usersListToggled: !state.usersListToggled,
                currentUsersFetchFunction: action.payload.fetchFunction
            } as IUserState
        }

        case 'SET_TOGGLE_USER_POSTS_LIST':{
            return {
                ...state,
                currentPostSelectionList: [],
                currentPostSelectionFunction: action.payload.fetchFunction
            } as IUserState
        }

        case 'ADD_USER_LIST_ENTRIES':{
            state.usersList = [...state.usersList,...action.payload.entries]

            return {
                ...state,
            } as IUserState
        }

        case 'ADD_USER_POSTS_ROW_LIST':{
            for(let row of action.payload.posts){
                state.currentPostSelectionList.push(row)
            }
            return {
                ...state,
            } as IUserState
        }

        case 'SET_USER_CLEAR':{
            return {
                ...state,
                currentPostSelectionList: [],
            } as IUserState
        }

        case 'RESET_USER_AVATAR_UPLOAD':{
            return {
                ...state,
                error:false,
                isUserAvatarUpdated:false,
            } as IUserState
        }

        case 'SET_CURRENT_USER_DATA_SUCCESS':{
            return {
                ...state,
                error:false,
                messege:action.payload.messege,
                isCurrentUserFollowed: action.payload.userData.isFollowing,
                currentUserPostsNum: action.payload.userData.posts,
                currentUserFollowersNum: action.payload.userData.followers,
                currentUserFollowingNum: action.payload.userData.following,
            } as IUserState
        }

        case 'SET_CURRENT_USER_DATA_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege
            } as IUserState
        }

        case 'SET_FOLLOW_SUGGESTED_SUCCESS':{
            state.suggestedUsers[action.payload.index].isFollowed = true;
            state.suggestedUsers[action.payload.index].isLoading = false;
            return {
                ...state,
                error:false,
                messege: action.payload.messege
            } as IUserState
        } 

        case 'SET_UNFOLLOW_SUGGESTED_SUCCESS':{
            state.suggestedUsers[action.payload.index].isFollowed = false;
            state.suggestedUsers[action.payload.index].isLoading = false;
            return {
                ...state,
                error:false,
                messege: action.payload.messege
            } as IUserState
        } 

        case 'SET_FOLLOW_SUGGESTED_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege,
            } as IUserState
        } 

        case 'SET_UNFOLLOW_SUGGESTED_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege,
            } as IUserState
        }  

        case 'SET_USER_SUGGESTED_LOADING':{
            state.suggestedUsers[action.payload.index].isLoading = true;
            return {
                ...state,
            } as IUserState
        }

        case 'SET_USER_USER_LIST_LOADING':{
            state.usersList[action.payload.index].isLoading = true;
            return {
                ...state,
            } as IUserState
        }

        case 'SET_FOLLOW_USER_LIST_SUCCESS':{
            state.usersList[action.payload.index].isFollowed = true;
            state.usersList[action.payload.index].isLoading = false;

            let usrToFind = state.usersList[action.payload.index].username;
            for(let i = 0; i < state.suggestedUsers.length;i++){
                let usr = state.suggestedUsers[i]
                if(usr.username === usrToFind){
                    state.suggestedUsers[i].isFollowed = true;
                    break;
                }
            }

            return {
                ...state,
                error:false,
                messege: action.payload.messege
            } as IUserState
        } 

        case 'SET_UNFOLLOW_USER_LIST_SUCCESS':{
            state.usersList[action.payload.index].isFollowed = false;
            state.usersList[action.payload.index].isLoading = false;

            let usrToFind = state.usersList[action.payload.index].username;
            for(let i = 0; i < state.suggestedUsers.length;i++){
                let usr = state.suggestedUsers[i]
                if(usr.username === usrToFind){
                    state.suggestedUsers[i].isFollowed = false;
                    break;
                }
            }
            return {
                ...state,
                error:false,
                messege: action.payload.messege
            } as IUserState
        } 

        case 'SET_FOLLOW_USER_LIST_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege,
            } as IUserState
        }

        case 'SET_UNFOLLOW_USER_LIST_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege,
            } as IUserState
        } 

        case 'SET_USER_USER_PAGE_LOADING':{
            return {
                ...state,
                isCurrentUserFollowLoading:true
            } as IUserState
        }

        case 'SET_FOLLOW_USER_PAGE_SUCCESS':{
            return {
                ...state,
                error:false,
                messege: action.payload.messege,
                isCurrentUserFollowed:true,
                isCurrentUserFollowLoading:false,
                currentUserFollowersNum: state.currentUserFollowersNum + 1
            } as IUserState
        } 

        case 'SET_UNFOLLOW_USER_PAGE_SUCCESS':{
            return {
                ...state,
                error:false,
                messege: action.payload.messege,
                isCurrentUserFollowed:false,
                isCurrentUserFollowLoading:false,
                currentUserFollowersNum: state.currentUserFollowersNum - 1
            } as IUserState
        } 

        case 'SET_FOLLOW_USER_PAGE_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege,
            } as IUserState
        }

        case 'SET_UNFOLLOW_USER_PAGE_FAILURE':{
            return {
                ...state,
                error:true,
                messege:action.payload.messege,
            } as IUserState
        } 

        default: {
            return {...state};
        }
    }
}

export default userReducer;