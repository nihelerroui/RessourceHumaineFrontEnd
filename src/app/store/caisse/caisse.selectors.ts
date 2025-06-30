import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CaisseState } from './caisse.reducer';


export const selectCaisseState = createFeatureSelector<CaisseState>('caisse');

export const selectCaisse = createSelector(
  selectCaisseState,
  (state: CaisseState) => state.caisse
);

export const selectSoldeCaisse = createSelector(
  selectCaisse,
  (caisse) => caisse ? caisse.soldeActuel : 0
);

export const selectCaisseLoading = createSelector(
  selectCaisseState,
  (state: CaisseState) => state.loading
);

export const selectCaisseError = createSelector(
  selectCaisseState,
  (state: CaisseState) => state.error
);

export const selectEntreesTotales = createSelector(
  selectCaisse,
  (caisse) => caisse ? caisse.entreesTotales : 0
);


export const selectPeutAugmenterSolde = createSelector(
  selectSoldeCaisse,
  (solde) => solde <= 1000
);

export const selectScore = createSelector(
  selectCaisse,
  (caisse) => caisse?.societe?.scoreTotal ?? null
);

export const selectNiveauSante = createSelector(
  selectCaisse,
  (caisse) => caisse?.societe?.niveauSante ?? null
);


