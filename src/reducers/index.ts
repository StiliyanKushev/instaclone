import {combineReducers} from "redux";

import authReducer, { IAuthState } from "./authReducer";

const allReducer = combineReducers({
    auth: authReducer,
});

export interface ReduxProps {
    auth?: IAuthState
}

export type AppState = ReturnType<typeof allReducer>;

export default allReducer;