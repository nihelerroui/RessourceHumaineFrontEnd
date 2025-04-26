import { createFeatureSelector, createSelector } from "@ngrx/store";
import type { FactureClientState } from "./factureclient.reducer";


export const selectFactureClientState = createFeatureSelector<FactureClientState>("factureClient");

export const selectTotalFactureClient = createSelector(
  selectFactureClientState,
    (state: FactureClientState) => state.factureClients.length 
  );

export const selectFactureClients = createSelector(
  selectFactureClientState,
  (state: FactureClientState) => state?.factureClients ?? [] 
);

export const selectLoading = createSelector(
  selectFactureClientState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectFactureClientState,
  (state) => state.error
);
export const selectFactureSelected = createSelector(
  selectFactureClientState,
  (state) => state.factureSelected
);
