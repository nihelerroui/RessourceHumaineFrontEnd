import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaysState } from './pays.reducer';

// 🔹 Sélectionner l'état de la fonctionnalité "Pays"
export const selectPaysState = createFeatureSelector<PaysState>('pays');

// 🔹 Sélectionner la liste complète des pays
export const selectPaysList = createSelector(
  selectPaysState,
  (state: PaysState) => state.paysList
);

// 🔹 Sélectionner un pays par son ID
export const selectPaysById = (paysId: number) =>
  createSelector(
    selectPaysState,
    (state: PaysState) => state.paysList.find((pays) => pays.paysId === paysId)
  );

// 🔹 Sélectionner l'état de chargement
export const selectPaysLoading = createSelector(
  selectPaysState,
  (state: PaysState) => state.loading
);

// 🔹 Sélectionner les erreurs éventuelles
export const selectPaysError = createSelector(
  selectPaysState,
  (state: PaysState) => state.error
);
