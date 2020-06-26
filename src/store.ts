//use redux
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import allReducer, { AppState } from './reducers';
import { AppActions } from './actions/types/actions';

const store = createStore(allReducer, composeWithDevTools(applyMiddleware(thunk as ThunkMiddleware<AppState,AppActions>)));

export default store;