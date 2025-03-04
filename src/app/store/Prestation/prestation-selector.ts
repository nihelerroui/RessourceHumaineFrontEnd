import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { PrestationState } from "./prestation.reducer"

export const selectPrestationState = createFeatureSelector<PrestationState>("prestation")

export const selectData = createSelector(selectPrestationState, (state: PrestationState) => state.prestations)

export const selectLoading = createSelector(selectPrestationState, (state: PrestationState) => state.loading)

export const selectError = createSelector(selectPrestationState, (state: PrestationState) => state.error)

