import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContratState } from '../contratSousTraitant/contrat.reducer';

// Sélecteur pour récupérer l'état global des contrats
export const selectContratState = createFeatureSelector<ContratState>('contrats');

// Sélecteur pour récupérer la liste des contrats
export const selectAllContracts = createSelector(
  selectContratState,
  (state: ContratState) => state.contrats
);
export const selectNbContratsEcheance = createSelector(
  selectContratState,
  (state: ContratState) => state.nbContratsEcheance
);
export const selectNbContratsEcheanceMoisPrecedent = createSelector(
  selectContratState,
  (state: ContratState) => state.nbContratsEcheanceMoisPrecedent
);


