// @flow
import type { ProfileState, Action } from '../types';
import { types } from 'actions';

const initialState: ProfileState = {
  authorized: false,
  host: null,
  userData: null,
  loginError: '',
};

function profile(state: ProfileState = initialState, action: Action) {
  switch (action.type) {
    case types.SET_AUTHORIZED:
      return {
        ...state,
        authorized: action.payload,
      };
    case types.FILL_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case types.SET_HOST:
      return {
        ...state,
        host: action.payload,
      };
    case types.THROW_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
      };
    case types.___CLEAR_ALL_REDUCERS___:
      return initialState;
    default:
      return state;
  }
}

export default profile;
