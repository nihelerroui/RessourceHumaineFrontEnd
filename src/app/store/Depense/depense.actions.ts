import { createAction, props } from '@ngrx/store';
import { Depense } from '../../shared/models/depense.model';

// Fetch Actions
export const fetchDepenseData = createAction('[Depense] Fetch Data');
export const fetchDepenseSuccess = createAction(
  '[Depense] Fetch Success',
  props<{ depenses: Depense[] }>()
);
export const fetchDepenseFailure = createAction(
  '[Depense] Fetch Failure',
  props<{ error: string }>()
);

// Create Actions
export const createDepense = createAction(
  '[Depense] Create',
  props<{ depense: Depense }>()
);
export const createDepenseSuccess = createAction(
  '[Depense] Create Success',
  props<{ depense: Depense }>()
);
export const createDepenseFailure = createAction(
  '[Depense] Create Failure',
  props<{ error: string }>()
);

// Update Actions
export const updateDepense = createAction(
  '[Depense] Update',
  props<{ depense: Depense }>()
);
export const updateDepenseSuccess = createAction(
  '[Depense] Update Success',
  props<{ depense: Depense }>()
);
export const updateDepenseFailure = createAction(
  '[Depense] Update Failure',
  props<{ error: string }>()
);

// Delete Actions
export const deleteDepense = createAction(
  '[Depense] Delete',
  props<{ id: number }>()
);
export const deleteDepenseSuccess = createAction(
  '[Depense] Delete Success',
  props<{ id: number }>()
);
export const deleteDepenseFailure = createAction(
  '[Depense] Delete Failure',
  props<{ error: string }>()
);