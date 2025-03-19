import { createAction, props } from '@ngrx/store';
import { Tresorie } from './tresorie.model';

// 🔹 Charger le solde actuel de la trésorerie
export const loadSoldeTresorie = createAction('[Tresorie] Load Solde');
export const loadSoldeTresorieSuccess = createAction(
  '[Tresorie] Load Solde Success',
  props<{ solde: number }>()
);
export const loadSoldeTresorieFailure = createAction(
  '[Tresorie] Load Solde Failure',
  props<{ error: string }>()
);

// 🔹 Mettre à jour le solde initial de la trésorerie
export const setSoldeInitial = createAction(
  '[Tresorie] Set Solde Initial',
  props<{ societeId: number; montant: number }>()
);
export const setSoldeInitialSuccess = createAction(
  '[Tresorie] Set Solde Initial Success',
  props<{ tresorie: Tresorie }>()
);
export const setSoldeInitialFailure = createAction(
  '[Tresorie] Set Solde Initial Failure',
  props<{ error: string }>()
);

// 🔹 Valider le paiement d’une facture et mettre à jour la trésorerie
export const validerPaiement = createAction(
  '[Tresorie] Valider Paiement',
  props<{ factureId: number }>()
);
export const validerPaiementSuccess = createAction(
  '[Tresorie] Valider Paiement Success',
  props<{ solde: number }>()
);
export const validerPaiementFailure = createAction(
  '[Tresorie] Valider Paiement Failure',
  props<{ error: string }>()
);
