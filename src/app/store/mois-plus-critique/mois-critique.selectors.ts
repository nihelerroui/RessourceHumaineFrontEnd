import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MoisCritiqueState } from './mois-critique.reducer';

export const selectMoisCritiqueState = createFeatureSelector<MoisCritiqueState>('moisCritique');

export const selectCriticalMonthData = createSelector(
  selectMoisCritiqueState,
  (state) => state.data?.mois_critique
);

export const selectCriticalMonthLoading = createSelector(
  selectMoisCritiqueState,
  (state) => state.loading
);

export const selectCriticalMonthError = createSelector(
  selectMoisCritiqueState,
  (state) => state.error
);
