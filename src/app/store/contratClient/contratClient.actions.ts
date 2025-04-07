import { createAction, props } from '@ngrx/store';
import { ContratClient } from "../../models/contratClient.models";

// 👉 Charger tous les contrats clients
export const loadContratsClient = createAction(
  "[ContratClient] Load Contrats"
);

export const loadContratsClientSuccess = createAction(
  "[ContratClient] Load Contrats Success",
  props<{ contrats: ContratClient[] }>()
);

export const loadContratsClientFailure = createAction(
  "[ContratClient] Load Contrats Failure",
  props<{ error: string }>()
);

// 👉 Importer un contrat client
export const importerContratClient = createAction(
  "[ContratClient] Importer Contrat",
  props<{ file: File; clientId: number; designation: string; tjm: number }>()
);

export const importerContratClientSuccess = createAction(
  "[ContratClient] Import Contrat Success",
  props<{ contrat: ContratClient }>()
);

export const importerContratClientFailure = createAction(
  "[ContratClient] Import Contrat Failure",
  props<{ error: string }>()
);

// 👉 Mettre à jour un contrat (valider/rejeter)
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

export const loadContratsClientByClientId = createAction(
  "[ContratClient] Load Contrats By Client ID",
  props<{ clientId: number }>()
);

export const loadContratsClientByClientIdSuccess = createAction(
  "[ContratClient] Load Contrats By Client ID Success",
  props<{ contrats: ContratClient[] }>()
);

export const loadContratsClientByClientIdFailure = createAction(
  "[ContratClient] Load Contrats By Client ID Failure",
  props<{ error: string }>()
);


