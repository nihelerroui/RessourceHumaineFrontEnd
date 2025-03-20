import { createAction, props } from '@ngrx/store';
import { Tresorie } from '../../models/tresorie.model';

// 🔹 Charger la trésorerie d'une société
export const loadTresorie = createAction(
  '[Tresorie] Load Tresorie',
  props<{ societeId: number }>() // ✅ Ajout du `societeId` pour la requête
);

export const loadTresorieSuccess = createAction(
  '[Tresorie] Load Tresorie Success',
  props<{ tresorie: Tresorie }>() // ✅ Retourne toute la trésorerie
);

export const loadTresorieFailure = createAction(
  '[Tresorie] Load Tresorie Failure',
  props<{ error: string }>()
);

// 🔹 Définir le solde initial d'une société
export const setSoldeInitial = createAction(
  '[Tresorie] Set Solde Initial',
  props<{ societeId: number; montant: number }>()
);

export const setSoldeInitialSuccess = createAction(
  '[Tresorie] Set Solde Initial Success',
  props<{ tresorie: Tresorie }>() // ✅ Retourne toute la trésorerie mise à jour
);

export const setSoldeInitialFailure = createAction(
  '[Tresorie] Set Solde Initial Failure',
  props<{ error: string }>()
);

// 🔹 Valider un paiement et mettre à jour la trésorerie
export const validerPaiement = createAction(
  '[Tresorie] Valider Paiement',
  props<{ factureId: number }>()
);

export const validerPaiementSuccess = createAction(
  '[Tresorie] Valider Paiement Success',
  props<{ tresorie: Tresorie }>() // ✅ Retourne toute la trésorerie mise à jour après paiement
);

export const validerPaiementFailure = createAction(
  '[Tresorie] Valider Paiement Failure',
  props<{ error: string }>()
);

// 🔹 Augmenter le solde actuel si solde = 1000
export const augmenterSoldeActuel = createAction(
  '[Tresorie] Augmenter Solde Actuel',
  props<{ societeId: number; montant: number }>()
);

export const augmenterSoldeActuelSuccess = createAction(
  '[Tresorie] Augmenter Solde Actuel Success',
  props<{ tresorie: Tresorie }>() // ✅ Retourne toute la trésorerie mise à jour
);

export const augmenterSoldeActuelFailure = createAction(
  '[Tresorie] Augmenter Solde Actuel Failure',
  props<{ error: string }>()
);
