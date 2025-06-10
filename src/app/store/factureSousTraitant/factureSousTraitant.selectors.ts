import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FactureSousTraitantState } from './factureSousTraitant.reducer';

export const selectFactureState = createFeatureSelector<FactureSousTraitantState>('FactureSousTraitant');

export const selectAllFactures = createSelector(
  selectFactureState,
  state => state.factures
);

export const selectFacturesLoading = createSelector(
  selectFactureState,
  state => state.loading
);

export const selectFacturesError = createSelector(
  selectFactureState,
  state => state.error
);
