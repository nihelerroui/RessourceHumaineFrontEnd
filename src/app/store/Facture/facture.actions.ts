import { createAction, props } from '@ngrx/store';

export const fetchFactureById = createAction(
  '[Facture] Fetch Facture By ID',
  props<{ id: number }>()
);

export const fetchFactureByIdSuccess = createAction(
  '[Facture] Fetch Facture By ID Success',
  props<{ facture: any }>()
);

export const fetchFactureByIdFailure = createAction(
  '[Facture] Fetch Facture By ID Failure',
  props<{ error: string }>()
);