import { createAction, props } from '@ngrx/store';
import { FactureClient } from 'src/app/models/factureClient.models';
import { Prestation } from 'src/app/models/prestation.model';

// Load
export const loadFacturesClient = createAction('[FactureClient] Load Factures');
export const loadFacturesClientSuccess = createAction('[FactureClient] Load Success', props<{ factures: FactureClient[] }>());
export const loadFacturesClientFailure = createAction('[FactureClient] Load Failure', props<{ error: any }>());
// Action pour charger les prestations d’un contrat
export const loadPrestationsByContrat = createAction(
  '[FactureClient] Load Prestations By Contrat',
  props<{ contratId: number }>()
);

export const loadPrestationsByContratSuccess = createAction(
  '[FactureClient] Load Prestations By Contrat Success',
  props<{ prestations: Prestation[] }>()
);

export const loadPrestationsByContratFailure = createAction(
  '[FactureClient] Load Prestations By Contrat Failure',
  props<{ error: any }>()
);

// Create
export const createFactureClient = createAction('[FactureClient] Create', props<{ facture: FactureClient }>());
export const createFactureClientSuccess = createAction('[FactureClient] Create Success', props<{ facture: FactureClient }>());
export const createFactureClientFailure = createAction('[FactureClient] Create Failure', props<{ error: any }>());
// Update
export const updateFactureClient = createAction('[FactureClient] Update', props<{ facture: FactureClient }>());
export const updateFactureClientSuccess = createAction('[FactureClient] Update Success', props<{ facture: FactureClient }>());
export const updateFactureClientFailure = createAction('[FactureClient] Update Failure', props<{ error: any }>());
//getFactureById
export const loadFactureClientById = createAction('[FactureClient] Load By Id', props<{ id: number }>());
export const loadFactureClientByIdSuccess = createAction('[FactureClient] Load By Id Success', props<{ facture: any }>());
export const loadFactureClientByIdFailure = createAction('[FactureClient] Load By Id Failure', props<{ error: any }>());
//delete facture
export const deleteFactureClient = createAction(
  '[FactureClient] Delete FactureClient',
  props<{ factureClientId: number }>()
);

export const deleteFactureClientSuccess = createAction(
  '[FactureClient] Delete FactureClient Success',
  props<{ factureClientId: number }>()
);

export const deleteFactureClientFailure = createAction(
  '[FactureClient] Delete FactureClient Failure',
  props<{ error: any }>()
);

export const loadFacturesClientByClientId = createAction(
  '[FactureClient] Load Factures Client By ClientId',
  props<{ clientId: number }>()
);

export const loadFacturesClientByClientIdSuccess = createAction(
  '[FactureClient] Load Factures Client By ClientId Success',
  props<{ factures: FactureClient[] }>()
);

export const loadFacturesClientByClientIdFailure = createAction(
  '[FactureClient] Load Factures Client By ClientId Failure',
  props<{ error: any }>()
);
//factures avec token
export const loadFactureClientByToken = createAction(
  '[FactureClient] Load By Token',
  props<{ token: string }>()
);

export const loadFactureClientByTokenSuccess = createAction(
  '[FactureClient] Load By Token Success',
  props<{ factures: FactureClient[] }>()
);

export const loadFactureClientByTokenFailure = createAction(
  '[FactureClient] Load By Token Failure',
  props<{ error: any }>()
);
// statut Confirmé_Admin ou Confirmation_Complet 
export const loadFacturesValideesByClientId = createAction(
  '[FactureClient] Load Validated By Client ID',
  props<{ clientId: number }>()
);
export const loadFacturesValideesByClientIdSuccess = createAction(
  '[FactureClient] Load Validated By Client ID Success',
  props<{ factures: FactureClient[] }>()
);
export const loadFacturesValideesByClientIdFailure = createAction(
  '[FactureClient] Load Validated By Client ID Failure',
  props<{ error: any }>()
);
// statut rejetee
export const loadFacturesRejeteesByClientId = createAction(
  '[FactureClient] Load Factures Rejetees By ClientId',
  props<{ clientId: number }>()
);

export const loadFacturesRejeteesByClientIdSuccess = createAction(
  '[FactureClient] Load Factures Rejetees By ClientId Success',
  props<{ factures: FactureClient[] }>()
);

export const loadFacturesRejeteesByClientIdFailure = createAction(
  '[FactureClient] Load Factures Rejetees By ClientId Failure',
  props<{ error: any }>()
);
// Envoi d’email de rappel
export const envoyerEmailFacture = createAction(
  '[FactureClient] Envoyer Email Facture',
  props<{ factureId: number }>()
);

export const envoyerEmailFactureSuccess = createAction(
  '[FactureClient] Envoyer Email Facture Success',
  props<{ message: string }>()
);

export const envoyerEmailFactureFailure = createAction(
  '[FactureClient] Envoyer Email Facture Failure',
  props<{ error: string }>()
);
// Load factures non payées par client
export const loadFacturesNonPayeesByClientId = createAction(
  '[FactureClient] Load Non Payees By Client ID',
  props<{ clientId: number }>()
);

export const loadFacturesNonPayeesByClientIdSuccess = createAction(
  '[FactureClient] Load Non Payees By Client ID Success',
  props<{ factures: FactureClient[] }>()
);

export const loadFacturesNonPayeesByClientIdFailure = createAction(
  '[FactureClient] Load Non Payees By Client ID Failure',
  props<{ error: any }>()
);
//télécharger une facture
export const downloadFacture = createAction(
  '[FactureClient] Download Facture',
  props<{ factureClientId: number }>()
);
//récupérer le nombre de jours travaillé
export const getWorkingDays = createAction(
  '[WorkingDays] Get Working Days',
  props<{ consultant_id: number; month: number; year: number; index: number }>()
);

export const getWorkingDaysSuccess = createAction(
  '[WorkingDays] Get Working Days Success',
  props<{ workingDays: number; index: number }>()
);

export const getWorkingDaysFailure = createAction(
  '[WorkingDays] Get Working Days Failure',
  props<{ error: any; index: number }>()
);
//load factures by societe admin 
export const loadFacturesBySocieteAdmin = createAction(
  '[FactureClient] Load Factures By Societe Admin'
);

export const loadFacturesBySocieteAdminSuccess = createAction(
  '[FactureClient] Load Factures By Societe Admin Success',
  props<{ factures: FactureClient[] }>()
);

export const loadFacturesBySocieteAdminFailure = createAction(
  '[FactureClient] Load Factures By Societe Admin Failure',
  props<{ error: any }>()
);