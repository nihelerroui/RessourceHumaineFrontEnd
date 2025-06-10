import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from './authentication.reducer';
import { selectSocieteState } from '../societe/societe.selectors';

export const selectAuthState = createFeatureSelector<AuthenticationState>('auth');

export const getUser = createSelector(
    selectAuthState,
    (state: AuthenticationState) => state.user
);

export const getisLoggedIn = createSelector(
    selectAuthState,
    (state: AuthenticationState) => state.isLoggedIn
);

export const getError = createSelector(
    selectAuthState,
    (state: AuthenticationState) => state.error
);


export const selectCreatedUser = createSelector(
  selectAuthState,
  state => state.user
);

export const selectUserId = createSelector(
  selectCreatedUser,
  user => user?.userId ?? null
);

export const selectCreatedConsultant = createSelector(
  selectAuthState,
  state => state.consultant
);

export const selectConsultantId = createSelector(
  selectCreatedConsultant,
  consultant => consultant?.consultantId ?? null
);

export const selectCreatedPersonalDetails = createSelector(
  selectAuthState,
  (state: AuthenticationState) => state.personalDetails
);

export const selectPersonalDetailsId = createSelector(
  selectCreatedPersonalDetails,
  personalDetails => personalDetails?.personalDetailsId ?? null
);


export const selectAuthLoading = createSelector(
  selectAuthState,
  state => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  state => state.error
);

export const selectAllConsultants = createSelector(
  selectAuthState,
  (state: AuthenticationState) => state.consultants
);

export const selectConsultantsLoading = createSelector(
  selectAuthState,
  (state: AuthenticationState) => state.loading
);

export const selectConsultantsError = createSelector(
  selectAuthState,
  (state: AuthenticationState) => state.error
);

export const selectAllSocietes = createSelector(
  selectAuthState,
  (state) => state.societes
);

export const selectSocietesLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectSocietesError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectAdminSocietes = createSelector(
  selectAuthState,
  (state) => state.societes
);