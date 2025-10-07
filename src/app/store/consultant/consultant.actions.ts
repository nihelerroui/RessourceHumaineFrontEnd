import { createAction, props } from '@ngrx/store';
import { Consultant } from 'src/app/models/consultant.models';

export const loadConsultantsBySociete = createAction(
  '[Consultant] Load Consultants By Societe',
  props<{ adminId: number }>()
);

export const loadConsultantsBySocieteSuccess = createAction(
  '[Consultant] Load Consultants By Societe Success',
  props<{ consultants: Consultant[] }>()
);

export const loadConsultantsBySocieteFailure = createAction(
  '[Consultant] Load Consultants By Societe Failure',
  props<{ error: any }>()
);
export const loadConsultantByMail = createAction(
  '[Consultant] Load Consultant By Mail',
  props<{ email: string }>()
);

export const loadConsultantByMailSuccess = createAction(
  '[Consultant] Load Consultant By Mail Success',
  props<{ consultant: Consultant }>()
);

export const loadConsultantByMailFailure = createAction(
  '[Consultant] Load Consultant By Mail Failure',
  props<{ error: any }>()
);