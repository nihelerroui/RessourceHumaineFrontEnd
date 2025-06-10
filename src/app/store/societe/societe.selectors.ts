import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SocieteState } from './societe.reducer';

export const selectSocieteState = createFeatureSelector<SocieteState>('societe');


export const selectSocieteList = createSelector(
  selectSocieteState,
  (state) => state.societes
);


export const selectSocieteById = (societeId: number) => createSelector(
  selectSocieteState,
  (state) => state.societes.find(s => s.societeId === societeId)
);


export const selectSocieteLoading = createSelector(
  selectSocieteState,
  (state) => state.loading
);


export const selectSocieteError = createSelector(
  selectSocieteState,
  (state) => state.error
);
