import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.state';
import { toggleUserStatusSuccess, toggleUserStatusFailure } from './user.actions';

export const userReducer = createReducer(
  initialUserState,
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


