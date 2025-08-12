import { createAction, props } from '@ngrx/store';
import { MoisCritiqueResponse } from '../../core/services/mois_critique.service';

export const loadCriticalMonth = createAction(
  '[Mois Critique] Load'
);

export const loadCriticalMonthSuccess = createAction(
  '[Mois Critique] Load Success',
  props<{ data: MoisCritiqueResponse }>()
);

export const loadCriticalMonthFailure = createAction(
  '[Mois Critique] Load Failure',
  props<{ error: any }>()
);
