import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FactureState } from './facture.reducer';

// Sélectionner l'état de la feature facture
export const selectFactureState = createFeatureSelector<FactureState>('facture');

// Sélectionner la liste des factures
export const selectFactureList = createSelector(
  selectFactureState,
  (state) => state.factures
);

// Sélectionner l'état de chargement
export const selectFactureLoading = createSelector(
  selectFactureState,
  (state) => state.loading
);

// Sélectionner les erreurs
export const selectFactureError = createSelector(
  selectFactureState,
  (state) => state.error
);
