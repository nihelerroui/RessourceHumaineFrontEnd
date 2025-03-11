import { createAction, props } from '@ngrx/store';
import { ContratClient } from "../contratClient/contratClient.models";

// Charger les contrats clients
export const loadContratsClient = createAction("[ContratClient] Load Contrats");

export const loadContratsClientSuccess = createAction(
  "[ContratClient] Load Contrats Success",
  props<{ contrats: ContratClient[] }>()
);

export const loadContratsClientFailure = createAction(
  "[ContratClient] Load Contrats Failure",
  props<{ error: string }>()
);

// Importer un contrat client
export const importerContratClient = createAction(
  "[ContratClient] Import Contrat",
  props<{ file: File; token: string; designation: string; tjm: number }>()
);

export const importerContratClientSuccess = createAction(
  "[ContratClient] Import Contrat Success",
  props<{ contrat: ContratClient }>()
);

export const importerContratClientFailure = createAction(
  "[ContratClient] Import Contrat Failure",
  props<{ error: string }>()
);
