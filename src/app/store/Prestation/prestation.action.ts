import { createAction, props } from '@ngrx/store';
import { Prestation, PrestationDTO } from 'src/app/models/prestation.model';

// Load all prestations
export const loadPrestations = createAction('[Prestation] Load Prestations');
export const loadPrestationsSuccess = createAction('[Prestation] Load Prestations Success', props<{ prestations: Prestation[] }>());
export const loadPrestationsFailure = createAction('[Prestation] Load Prestations Failure', props<{ error: any }>());

// Create
export const createPrestation = createAction('[Prestation] Create Prestation', props<{ prestationDTO: PrestationDTO }>());
export const createPrestationSuccess = createAction('[Prestation] Create Prestation Success', props<{ prestation: Prestation }>());
export const createPrestationFailure = createAction('[Prestation] Create Prestation Failure', props<{ error: any }>());

// Update
export const updatePrestation = createAction(
  '[Prestation] Update Prestation',
  props<{ prestationDTO: PrestationDTO }>()
);

export const updatePrestationSuccess = createAction('[Prestation] Update Prestation Success', props<{ prestation: Prestation }>());
export const updatePrestationFailure = createAction('[Prestation] Update Prestation Failure', props<{ error: any }>());
//delete
export const deletePrestation = createAction('[Prestation] Delete Prestation', props<{ id: number }>() );
export const deletePrestationSuccess = createAction( '[Prestation] Delete Prestation Success', props<{ id: number }>() );
export const deletePrestationFailure = createAction('[Prestation] Delete Prestation Failure', props<{ error: string }>() );