import { createStore, applyMiddleware } from "redux";
// the thunk middle ware will allow us to do async activities with functions in a dispatch() call before getting to the reducer,allowing the async functions logic to dispatch the reducer when its done with its bussiness
import thunkMiddleware from 'redux-thunk';
// this will allow us to use redux dev tools extension
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from './reducer';


const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancer);

export default store;