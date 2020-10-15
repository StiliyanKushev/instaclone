import { navSearchTypes  } from './navSearchActions';
import { authActionTypes } from "./authActions";
import { userActionTypes } from "./userActions";
import { postActionTypes } from "./postActions";
import { inboxTypes } from './inboxActions';

export type AppActions = authActionTypes | userActionTypes | postActionTypes | navSearchTypes | inboxTypes;