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

export const loadDepenses = createAction(
  '[Depense] Load Depenses',
  props<{ societeId: number }>()
);

export const loadDepensesSuccess = createAction(
  '[Depense] Load Depenses Success',
  props<{ depenses: Depense[] }>()
);

export const loadDepensesFailure = createAction(
  '[Depense] Load Depenses Failure',
  props<{ error: any }>()
);

