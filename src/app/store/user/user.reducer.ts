import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.state';
import { loadUsers, loadUsersSuccess, loadUsersFailure, toggleUserStatusSuccess, toggleUserStatusFailure } from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(loadUsers, state => ({ ...state, loading: true, error: null })),
  on(loadUsersSuccess, (state, { users }) => ({ ...state, loading: false, users })),
  on(loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(toggleUserStatusSuccess, (state, { userId, enabled }) => ({
    ...state,
    users: state.users.map(user =>
      user.userId === userId ? { ...user, enabled } : user
    )
  })),

  on(toggleUserStatusFailure, (state, { error }) => ({
    ...state,
    error
  }))  
);


