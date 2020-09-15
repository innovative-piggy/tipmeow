import { combineReducers } from 'redux';
import stripeConnection from './stripeConnection';
const rootReducer = combineReducers({
    stripeConnection
});

export default rootReducer;