import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConsultantState } from './consultant.reducer';

export const selectConsultantState = createFeatureSelector<ConsultantState>('consultant');

export const selectAllConsultants = createSelector(
  selectConsultantState,
  state => state.consultants
);
export const selectLoading = createSelector(
  selectConsultantState,
  (state: ConsultantState) => state.loading
);

export const selectError = createSelector(
  selectConsultantState,
  (state: ConsultantState) => state.error
);
