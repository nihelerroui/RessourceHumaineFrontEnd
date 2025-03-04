// src/app/store/Prestation/prestation.action.ts
import { createAction, props } from '@ngrx/store';

export const fetchPrestationData = createAction('[Prestation] Fetch Prestation Data');
export const fetchPrestationDataSuccess = createAction(
  '[Prestation] Fetch Prestation Data Success',
  props<{ prestations: any[] }>()
);
export const fetchPrestationDataFailure = createAction(
  '[Prestation] Fetch Prestation Data Failure',
  props<{ error: string }>()
);

export const deletePrestation = createAction(
    '[Prestation] Delete Prestation',
    props<{ id: number }>()
  );
  export const deletePrestationSuccess = createAction(
    '[Prestation] Delete Prestation Success',
    props<{ id: number }>()
  );
  export const deletePrestationFailure = createAction(
    '[Prestation] Delete Prestation Failure',
    props<{ error: string }>()
  );