import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TresorieState } from './tresorie.reducer';

// 🔹 Sélectionne l'état de la trésorerie dans le store
export const selectTresorieState = createFeatureSelector<TresorieState>('tresorie');

// 🔹 Sélectionne l'objet complet de la trésorerie
export const selectTresorie = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.tresorie
);

// 🔹 Sélectionne le solde actuel depuis l'objet Tresorie (pas un champ séparé)
export const selectSoldeTresorie = createSelector(
  selectTresorie,
  (tresorie) => tresorie ? tresorie.soldeActuel : 0
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

// 🔹 Sélectionne les entrées totales depuis l'objet Tresorie
export const selectEntreesTotales = createSelector(
  selectTresorie,
  (tresorie) => tresorie ? tresorie.entreesTotales : 0
);

// 🔹 Sélectionne la possibilité d'augmenter le solde (si solde actuel <= 1000)
export const selectPeutAugmenterSolde = createSelector(
  selectSoldeTresorie,
  (solde) => solde <= 1000
);

