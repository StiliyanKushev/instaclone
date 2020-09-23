import { navSearchTypes  } from './navSearchActions';
import { authActionTypes } from "./authActions";
import { userActionTypes } from "./userActions";
import { postActionTypes } from "./postActions";

export type AppActions = authActionTypes | userActionTypes | postActionTypes | navSearchTypes;