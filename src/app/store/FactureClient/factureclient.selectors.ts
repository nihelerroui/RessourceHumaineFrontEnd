import { createFeatureSelector, createSelector } from "@ngrx/store";
import type { FactureClientState } from "./factureclient.reducer";

// Selector to select the FactureClientState
export const selectFactureClientState = createFeatureSelector<FactureClientState>("factureClient");

// Selector to get all factureClients, returning an empty array if factureClients is undefined
export const selectFactureClients = createSelector(
  selectFactureClientState,
  (state: FactureClientState) => state?.factureClients ?? [] // Safe default: empty array
);

// Selector to get facturePreview, returning null if undefined
export const selectFacturePreview = createSelector(
  selectFactureClientState,
  (state: FactureClientState) => state?.facturePreview ?? null // Safe default: null
);

// Selector to get loading state, returning false if undefined
export const selectLoading = createSelector(
  selectFactureClientState,
  (state: FactureClientState) => state?.loading ?? false // Safe default: false
);

// Selector to get error state, returning null if undefined
export const selectError = createSelector(
  selectFactureClientState,
  (state: FactureClientState) => state?.error ?? null // Safe default: null
);
