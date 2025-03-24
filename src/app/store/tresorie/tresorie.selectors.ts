import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TresorieState } from './tresorie.reducer';

// 🔹 Sélectionne l'état de la trésorerie dans le store
export const selectTresorieState = createFeatureSelector<TresorieState>('tresorie');

// 🔹 Sélectionne le solde actuel de la trésorerie
export const selectSoldeTresorie = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.solde
);

// 🔹 Sélectionne l'objet complet de la trésorerie
export const selectTresorie = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.tresorie
);

// 🔹 Sélectionne l'état de chargement (loading)
export const selectTresorieLoading = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.loading
);

// 🔹 Sélectionne les erreurs éventuelles
export const selectTresorieError = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.error
);
