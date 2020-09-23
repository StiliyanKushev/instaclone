import {combineReducers} from "redux";

import authReducer, { IAuthState } from "./authReducer";
import userReducer, { IUserState } from "./userReducer";
import postReducer, { IPostState } from "./postReducer";
import navSearchReducer, { INavSearchState } from "./navSearchReducer";

const allReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    navSearch: navSearchReducer,
});

export interface ReduxProps {
    auth?: IAuthState,
    user?: IUserState,
    post?: IPostState,
    navSearch?: INavSearchState,
}

export type AppState = ReturnType<typeof allReducer>;

export default allReducer;