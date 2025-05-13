import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChiffreAffaireState } from './ChiffreAffaire.reducer';

export const selectChiffreAffaireState = createFeatureSelector<ChiffreAffaireState>('chiffreAffaire');

export const selectHistorique = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.historique
);

export const selectTotalFactures = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.montantTotal
);

export const selectTotalFacturesPayees = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.montantTotalPayees
);

export const selectLoading = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.loading
);

export const selectError = createSelector(
  selectChiffreAffaireState,
  (state: ChiffreAffaireState) => state.error
);
