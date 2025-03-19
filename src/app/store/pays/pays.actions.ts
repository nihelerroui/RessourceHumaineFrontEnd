import { createAction, props } from '@ngrx/store';
import { Pays } from '../../models/pays.model';

// 🔹 Charger la liste des pays
export const loadPays = createAction('[Pays] Load Pays');
export const loadPaysSuccess = createAction(
'[Pays] Load Pays Success',
  props<{ paysList: Pays[] }>()
);
export const loadPaysFailure = createAction(
  '[Pays] Load Pays Failure',
  props<{ error: string }>()
);

// 🔹 Ajouter un pays
export const addPays = createAction(
  '[Pays] Add Pays',
  props<{ pays: Pays }>()
);
export const addPaysSuccess = createAction(
  '[Pays] Add Pays Success',
  props<{ pays: Pays }>()
);
export const addPaysFailure = createAction(
  '[Pays] Add Pays Failure',
  props<{ error: string }>()
);

// 🔹 Mettre à jour un pays
export const updatePays = createAction(
  '[Pays] Update Pays',
  props<{ pays: Pays }>()
);
export const updatePaysSuccess = createAction(
  '[Pays] Update Pays Success',
  props<{ pays: Pays }>()
);
export const updatePaysFailure = createAction(
  '[Pays] Update Pays Failure',
  props<{ error: string }>()
);

// 🔹 Supprimer un pays
export const deletePays = createAction(
  '[Pays] Delete Pays',
  props<{ paysId: number }>()
);
export const deletePaysSuccess = createAction(
  '[Pays] Delete Pays Success',
  props<{ paysId: number }>()
);
export const deletePaysFailure = createAction(
  '[Pays] Delete Pays Failure',
  props<{ error: string }>()
);
