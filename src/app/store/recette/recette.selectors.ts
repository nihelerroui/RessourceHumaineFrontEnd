import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecetteState } from './recette.reducer';

export const selectRecetteState = createFeatureSelector<RecetteState>('recettes');

export const selectAllRecettes = createSelector(
  selectRecetteState,
  (state) => state.recettes
);

export const selectRecetteLoading = createSelector(
  selectRecetteState,
  (state) => state.loading
);

export const selectRecetteError = createSelector(
  selectRecetteState,
  (state) => state.error
);


export const selectAllRecettesBySociete = createSelector(
  selectRecetteState,
  state => state.recettes
);

export const selectRecettesBySocieteLoading = createSelector(
  selectRecetteState,
  state => state.loading
);

export const selectRecettesBySocieteError = createSelector(
  selectRecetteState,
  state => state.error
);