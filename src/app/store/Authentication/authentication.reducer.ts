import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './authentication.actions';

export interface AuthState {
  user: any | null;
  accessToken: string | null;
  tokenType: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  accessToken: null,
  tokenType: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  // Login Reducers
  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { accessToken, tokenType }) => ({
    ...state,
    accessToken,
    tokenType,
    loading: false
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Register Reducers
  on(AuthActions.register, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.registerSuccess, (state, { authResponse }) => ({
    ...state,
    accessToken: authResponse.accessToken,
    tokenType: authResponse.tokenType,
    loading: false
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Get User Reducers
  on(AuthActions.getUser, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.getUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false
  })),
  on(AuthActions.getUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
