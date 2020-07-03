import {combineReducers} from "redux";

import authReducer, { IAuthState } from "./authReducer";
import userReducer, { IUserState } from "./userReducer";

const allReducer = combineReducers({
    auth: authReducer,
    user: userReducer
});

export interface ReduxProps {
    auth?: IAuthState,
    user?: IUserState
}

export type AppState = ReturnType<typeof allReducer>;

export default allReducer;