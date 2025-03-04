import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DepenseState } from './depense.reducer';

export const selectDepenseState = createFeatureSelector<DepenseState>('depense');

export const selectData = createSelector(
  selectDepenseState,
  (state) => state.depenses
);

export const selectLoading = createSelector(
  selectDepenseState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectDepenseState,
  (state) => state.error
);