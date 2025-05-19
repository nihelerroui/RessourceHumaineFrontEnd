import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConsultantState } from './consultant.reducer';

export const selectConsultantState = createFeatureSelector<ConsultantState>('consultants');

export const selectAllConsultants = createSelector(
  selectConsultantState,
  state => state.consultants
);
