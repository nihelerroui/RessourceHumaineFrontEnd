import { createAction, props } from '@ngrx/store';

export const loadConsultantsBySociete = createAction(
  '[Consultant] Load Consultants By Societe',
  props<{ consultantId: number }>()
);

export const loadConsultantsBySocieteSuccess = createAction(
  '[Consultant] Load Consultants By Societe Success',
  props<{ consultants: any[] }>()
);

export const loadConsultantsBySocieteFailure = createAction(
  '[Consultant] Load Consultants By Societe Failure',
  props<{ error: any }>()
);
