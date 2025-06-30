import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TresorerieState } from './tresorerie.reducer';

export const selectTresorerieState = createFeatureSelector<TresorerieState>('tresorerie');

export const selectTresorerie = createSelector(
  selectTresorerieState,
  (state) => state.tresorerie
);

export const selectTresorerieLoading = createSelector(
  selectTresorerieState,
  (state) => state.loading
);

export const selectTresorerieError = createSelector(
  selectTresorerieState,
  (state) => state.error
);
