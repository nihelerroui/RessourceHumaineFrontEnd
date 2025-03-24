import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FactureState } from './facture.reducer';

// 🔹 Sélectionner l'état de la fonctionnalité "Facture"
export const selectFactureState = createFeatureSelector<FactureState>('facture');

// 🔹 Sélectionner la liste complète des factures
export const selectFactureList = createSelector(
  selectFactureState,
  (state: FactureState) => state.factures
);

// 🔹 Sélectionner une facture par son ID
export const selectFactureById = (factureId: number) =>
  createSelector(
    selectFactureState,
    (state: FactureState) => state.factures.find((facture) => facture.factureId === factureId)
  );

// 🔹 Sélectionner l'état de chargement des factures
export const selectFactureLoading = createSelector(
  selectFactureState,
  (state: FactureState) => state.loading
);

// 🔹 Sélectionner les erreurs éventuelles liées aux factures
export const selectFactureError = createSelector(
  selectFactureState,
  (state: FactureState) => state.error
);
