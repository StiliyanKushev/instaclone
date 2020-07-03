import {combineReducers} from "redux";

import authReducer, { IAuthState } from "./authReducer";
import userReducer, { IUserState } from "./userReducer";
import postReducer, { IPostState } from "./postReducer";

const allReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    post: postReducer
});

export interface ReduxProps {
    auth?: IAuthState,
    user?: IUserState,
    post?: IPostState
}

export type AppState = ReturnType<typeof allReducer>;

export default allReducer;