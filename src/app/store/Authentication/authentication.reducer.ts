import { createReducer, on } from '@ngrx/store';
import { registerUser , login, loginFailure, loginSuccess, logout, registerUserSuccess, registerUserFailure } from './authentication.actions';
import { User } from '../../models/auth.models';

export interface AuthenticationState {
    isLoggedIn: boolean;
    user: User | null;
    error: string | null;
}

const initialState: AuthenticationState = {
    isLoggedIn: false,
    user: null,
    error: null,
};

export const authenticationReducer = createReducer(
    initialState,
    on(registerUser, (state) => ({ ...state, error: null })),
    on(registerUserSuccess, (state) => ({
        ...state,
        isLoggedIn: state.isLoggedIn,
        error: null,
      })),  
    on(registerUserFailure, (state, { error }) => ({ ...state, error })),
    on(login, (state) => ({ ...state, error: null })),
    on(loginSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null, })),
    on(loginFailure, (state, { error }) => ({ ...state, error })),
    on(logout, (state) => ({ ...state, user: null })),


);
