import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { FactureState } from './facture.reducer';

export const selectFactureState = createFeatureSelector<FactureState>('facture');

export const selectFacture = createSelector(
  selectFactureState,
  (state: FactureState) => state.facture
);

export const selectLoading = createSelector(
  selectFactureState,
  (state: FactureState) => state.loading
);

export const selectError = createSelector(
  selectFactureState,
  (state: FactureState) => state.error
);