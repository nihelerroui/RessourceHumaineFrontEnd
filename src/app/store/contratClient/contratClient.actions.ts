import { createAction, props } from '@ngrx/store';
import { ContratClient } from "../../models/contratClient.models";

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
// Mettre à jour un contrat (Valider/Rejeter)
export const updateContratClient = createAction(
  "[ContratClient] Update Contrat",
  props<{ contrat: ContratClient }>()
);

export const updateContratClientSuccess = createAction(
  "[ContratClient] Update Contrat Success",
  props<{ contrat: ContratClient }>()
);

export const updateContratClientFailure = createAction(
  "[ContratClient] Update Contrat Failure",
  props<{ error: string }>()
);

// Charger les contrats client par token
export const loadContratsClientByToken = createAction(
  "[ContratClient] Load Contrats By Token",
  props<{ token: string }>()
);

export const loadContratsClientByTokenSuccess = createAction(
  "[ContratClient] Load Contrats By Token Success",
  props<{ contrats: ContratClient[] }>()
);

export const loadContratsClientByTokenFailure = createAction(
  "[ContratClient] Load Contrats By Token Failure",
  props<{ error: string }>()
);


