import { createAction, props } from '@ngrx/store';
import { Depense } from 'src/app/models/depense.model';

export const fetchDepenseData = createAction('[Depense] Fetch Depense Data');
export const fetchDepenseDataSuccess = createAction(
  '[Depense] Fetch Depense Data Success',
  props<{ depenses: Depense[] }>()
);
export const fetchDepenseDataFailure = createAction(
  '[Depense] Fetch Depense Data Failure',
  props<{ error: string }>()
);

