import { createAction, props } from '@ngrx/store';
import { Societe } from '../../models/societe.model';


export const loadSocietes = createAction('[Societe] Load Societes');
export const loadSocietesSuccess = createAction('[Societe] Load Societes Success', props<{ societes: Societe[] }>());
export const loadSocietesFailure = createAction('[Societe] Load Societes Failure', props<{ error: string }>());


export const addSociete = createAction('[Societe] Add Societe', props<{ societe: Societe }>());
export const addSocieteSuccess = createAction('[Societe] Add Societe Success', props<{ societe: Societe }>());
export const addSocieteFailure = createAction('[Societe] Add Societe Failure', props<{ error: string }>());


export const updateSociete = createAction('[Societe] Update Societe', props<{ societe: Societe }>());
export const updateSocieteSuccess = createAction('[Societe] Update Societe Success', props<{ societe: Societe }>());
export const updateSocieteFailure = createAction('[Societe] Update Societe Failure', props<{ error: string }>());
