import { combineReducers } from 'redux';
import {
  SET_NAV,
  USER_LOGGED,
  WAITING,
  DONE_WAITING,
  RETRIEVED_USER_INFO,
  USER_LOGGED_OUT
} from '../Actions';

const options = {
  keyPrefix: 'sports/',
  bucket: 'sportcoapp-assets',
  region: 'eu-west-3',
  successActionStatus: 201
};

function auth(state = { user: null, waiting: false }, action) {
  switch (action.type) {
    case SET_NAV:
      var nextState = {
        ...state,
        reduxNavigation: action.value
      };
      return nextState;
    case WAITING:
      var nextState = {
        ...state,
        waiting: true
      };
      return nextState;
    case DONE_WAITING:
      var nextState = {
        ...state,
        waiting: false
      };
      return nextState;
    case USER_LOGGED:
      let user = action.value;
      var nextState = {
        ...state,
        user: user,
        user_id: action.additionalInfo,
        s3Options: options
      };
      return nextState;
    case USER_LOGGED_OUT:
      user = action.value;
      var nextState = {
        ...state,
        user: undefined,
        s3Options: options
      };
      return nextState;
    case RETRIEVED_USER_INFO:
      var nextState = {
        ...state,
        user: action.value
      };
      return nextState;
    default:
      return state;
  }

}

const rootReducer = combineReducers({
  auth
});

export default rootReducer;
