import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { PrestationState } from "./prestation.reducer"
import { ContratClientState } from "../contratClient/contratClient.reducer";

export const selectPrestationState = createFeatureSelector<PrestationState>('prestations');
export const selectContratState = createFeatureSelector<ContratClientState>('contratsClient');

export const selectAllPrestations = createSelector(
    selectPrestationState,
    state => state.prestations
);

export const selectLoading = createSelector(
    selectPrestationState,
    state => state.loading
);

export const selectError = createSelector(
    selectPrestationState,
    state => state.error
);

export const selectTotalPrestations = createSelector(
    selectPrestationState,
    (state: PrestationState) => state.prestations.length 
  );

export const selectAllContrats = createSelector(
  selectContratState,
  state => state.contrats
);

export const selectLoadingContrats = createSelector(
  selectContratState,
  state => state.loading
);

export const selectErrorContrats = createSelector(
  selectContratState,
  state => state.error
);