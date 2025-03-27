import { createAction, props } from "@ngrx/store";
import { ContratSousTraitant } from "../../models/contrat.models";

// Charger la liste des contrats
export const loadContracts = createAction("[Contrat] Load Contracts");
export const loadContractsSuccess = createAction(
  "[Contrat] Load Contracts Success",
  props<{ contrats: ContratSousTraitant[] }>()
);
export const loadContractsFailure = createAction(
  "[Contrat] Load Contracts Failure",
  props<{ error: string }>()
);
//charger la liste des contrats par sous-traintant
export const loadContractsByConsultant = createAction(
  '[Contrat] Load Contracts By Consultant',
  props<{ consultantId: number }>()
);


// Ajouter un contrat
export const addContract = createAction(
  "[Contrat] Add Contract",
  props<{ contrat: ContratSousTraitant; fichier: File }>()
);
export const addContractSuccess = createAction(
  "[Contrat] Add Contract Success",
  props<{ contrat: ContratSousTraitant }>()
);
export const addContractFailure = createAction(
  "[Contrat] Add Contract Failure",
  props<{ error: string }>()
);

// Télécharger un contrat
export const downloadContract = createAction(
  "[Contrat] Download Contract",
  props<{ contratId: number }>()
);
export const downloadContractSuccess = createAction(
  "[Contrat] Download Contract Success",
  props<{ contratId: number; file: Blob }>()
);
export const downloadContractFailure = createAction(
  "[Contrat] Download Contract Failure",
  props<{ error: string }>()
);
//supprimer un contrat
export const deleteContract = createAction(
  "[Contrat] Supprimer Contrat",
  props<{ id: number }>()
);
export const deleteContractSuccess = createAction(
  "[Contrat] Supprimer Contrat Success",
  props<{ id: number}>()
);
export const deleteContractFailure = createAction(
  "[Contrat] Supprimer Contrat Failure",
  props<{ error: string}>()
);
//Modifier un contrat
export const updateContract = createAction(
  "[Contrat] Update Contract",
  props<{ id: number; contrat: ContratSousTraitant; fichier?: File }>()
);
export const updateContractSuccess = createAction(
  "[Contrat] Update Contract Success",
  props<{ contrat: ContratSousTraitant }>()
);
export const updateContractFailure = createAction(
  "[Contrat] Update Contract Failure",
  props<{ error: string }>()
);
// Recherche avancée avec filtres
export const searchContracts = createAction(
  "[Contrat] Search Contracts",
  props<{ filters: any }>()
);

export const searchContractsSuccess = createAction(
  "[Contrat] Search Contracts Success",
  props<{ contrats: ContratSousTraitant[] }>()
);

export const searchContractsFailure = createAction(
  "[Contrat] Search Contracts Failure",
  props<{ error: string }>()
);
