import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SocieteState } from './societe.reducer';

export const selectSocieteState = createFeatureSelector<SocieteState>('societe');

// Sélectionner toutes les sociétés
export const selectSocieteList = createSelector(
  selectSocieteState,
  (state) => state.societes
);

// Sélectionner une société par ID
export const selectSocieteById = (societeId: number) => createSelector(
  selectSocieteState,
  (state) => state.societes.find(s => s.societeId === societeId)
);

// Sélectionner l'état de chargement
export const selectSocieteLoading = createSelector(
  selectSocieteState,
  (state) => state.loading
);

// Sélectionner les erreurs
export const selectSocieteError = createSelector(
  selectSocieteState,
  (state) => state.error
);

// Sociétés administrées par l'admin connecté
export const selectSocietesAdministrees = createSelector(
  selectSocieteState,
  (state) => state.societesAdministrees
);
