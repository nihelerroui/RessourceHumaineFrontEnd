import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TresorieState } from './tresorie.reducer';


export const selectTresorieState = createFeatureSelector<TresorieState>('tresorie');

export const selectTresorie = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.tresorie
);

export const selectSoldeTresorie = createSelector(
  selectTresorie,
  (tresorie) => tresorie ? tresorie.soldeActuel : 0
);

export const selectTresorieLoading = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.loading
);

export const selectTresorieError = createSelector(
  selectTresorieState,
  (state: TresorieState) => state.error
);

export const selectEntreesTotales = createSelector(
  selectTresorie,
  (tresorie) => tresorie ? tresorie.entreesTotales : 0
);


export const selectPeutAugmenterSolde = createSelector(
  selectSoldeTresorie,
  (solde) => solde <= 1000
);

export const selectScore = createSelector(
  selectTresorie,
  (tresorie) => tresorie?.societe?.scoreTotal ?? null
);

export const selectNiveauSante = createSelector(
  selectTresorie,
  (tresorie) => tresorie?.societe?.niveauSante ?? null
);


