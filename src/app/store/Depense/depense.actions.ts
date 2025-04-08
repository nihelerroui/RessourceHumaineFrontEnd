import { createAction, props } from '@ngrx/store';

export const fetchDepenseData = createAction('[Depense] Fetch Depense Data');
export const fetchDepenseDataSuccess = createAction(
  '[Depense] Fetch Depense Data Success',
  props<{ depenses: any[] }>()
);
export const fetchDepenseDataFailure = createAction(
  '[Depense] Fetch Depense Data Failure',
  props<{ error: string }>()
);

