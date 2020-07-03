const SET_USER_UPDATE_AVATER_SUCCESS = 'SET_USER_UPDATE_AVATER_SUCCESS';
const SET_USER_UPDATE_AVATER_FAILURE = 'SET_USER_UPDATE_AVATER_FAILURE';
const SET_USER_LOADING = 'SET_USER_LOADING';

export  interface setUserLoading{
    type: typeof SET_USER_LOADING,
}

export interface setUserUpdateAvatarSuccess {
    type: typeof SET_USER_UPDATE_AVATER_SUCCESS,
    payload:{
        messege:string
    }
}

export interface setUserUpdateAvatarFailure {
    type: typeof SET_USER_UPDATE_AVATER_FAILURE,
    payload:{
        messege:string
    }
}


export type userActionTypes = setUserUpdateAvatarSuccess | setUserUpdateAvatarFailure | setUserLoading; 