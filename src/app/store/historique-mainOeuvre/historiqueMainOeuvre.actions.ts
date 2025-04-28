import { createAction, props } from '@ngrx/store';
import { HistoriqueMainOeuvre } from 'src/app/models/historique-mainOeuvre';

export const loadHistoriqueMainOeuvre = createAction(
  '[HistoriqueMainOeuvre] Load HistoriqueMainOeuvre',
  props<{ consultantId: number; year: number }>()
);

export const loadHistoriqueMainOeuvreSuccess = createAction(
  '[HistoriqueMainOeuvre] Load Success',
  props<{ data: HistoriqueMainOeuvre[] }>()
);

export const loadHistoriqueMainOeuvreFailure = createAction(
  '[HistoriqueMainOeuvre] Load Failure',
  props<{ error: string }>()
);



