import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChiffreAffaireState } from './ChiffreAffaire.reducer';

// Racine du state
export const selectChiffreAffaireState = createFeatureSelector<ChiffreAffaireState>('chiffreAffaire');

// Sélecteur de la liste des historiques
export const selectAllChiffres = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.historique
);

// Nombre total d’entrées dans la liste
export const selectNombreChiffres = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.historique.length
);

// Total global (factures)
export const selectTotalByClient = (clientId: number) =>
  createSelector(
    selectChiffreAffaireState,
    (state: ChiffreAffaireState) => state.totalByClient[clientId] || 0
  );


// Total des factures payées
export const selectTotalPayeesByClient = (clientId: number) =>
  createSelector(
    selectChiffreAffaireState,
    (state: ChiffreAffaireState) => state.totalPayeesByClient[clientId] ?? 0
  );

// Loading state
export const selectLoading = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.loading
);

// Error
export const selectError = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.error
);
