import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContratState } from '../contrat/contrat.reducer';

// Sélecteur pour récupérer l'état global des contrats
export const selectContratState = createFeatureSelector<ContratState>('contrats');

// Sélecteur pour récupérer la liste des contrats
export const selectAllContracts = createSelector(
  selectContratState,
  (state: ContratState) => state.contrats
);
