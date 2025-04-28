import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HistoriqueMainOeuvreState } from './historiqueMainOeuvre.reducer';

export const selectHistoriqueMainOeuvreState =
  createFeatureSelector<HistoriqueMainOeuvreState>('historiqueMainOeuvre');

export const selectHistoriqueMainOeuvreData = createSelector(
  selectHistoriqueMainOeuvreState,
  (state) => state.data
);



export const selectHistoriqueMainOeuvreLoading = createSelector(
  selectHistoriqueMainOeuvreState,
  (state) => state.loading
);

export const selectHistoriqueMainOeuvreError = createSelector(
  selectHistoriqueMainOeuvreState,
  (state) => state.error
);
