import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './authentication.reducer';

// Selector to select the authentication state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state?.user
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state?.accessToken
);



export const selectTokenType = createSelector(
  selectAuthState,
  (state: AuthState) => state?.tokenType
);

export const selectLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state?.loading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state?.error
);
