import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { DepenseState } from "./depense.reducer"

export const selectDepenseState = createFeatureSelector<DepenseState>("depense")

export const selectData = createSelector(selectDepenseState, (state: DepenseState) => state.depenses)

export const selectLoading = createSelector(selectDepenseState, (state: DepenseState) => state.loading)

export const selectError = createSelector(selectDepenseState, (state: DepenseState) => state.error)
