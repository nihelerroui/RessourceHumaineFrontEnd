import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MainOeuvreState } from './mainOeuvre.reducer';

export const selectMainOeuvreState = createFeatureSelector<MainOeuvreState>('mainOeuvre');

export const selectMainOeuvreData = createSelector(
  selectMainOeuvreState,
  state => state.data
);

export const selectMainOeuvreLoading = createSelector(
  selectMainOeuvreState,
  state => state.loading
);

export const selectMainOeuvreError = createSelector(
  selectMainOeuvreState,
  state => state.error
);

export const selectVerificationLoading = createSelector(
  selectMainOeuvreState,
  state => state.verificationLoading
);


