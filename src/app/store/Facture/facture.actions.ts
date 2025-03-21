import { createAction, props } from '@ngrx/store';
import { Facture } from '../../models/facture.model'; 

// 🔹 Charger la liste des factures
export const loadFactures = createAction('[Facture] Load Factures');
export const loadFacturesSuccess = createAction(
  '[Facture] Load Factures Success',
  props<{ factures: Facture[] }>()
);
export const loadFacturesFailure = createAction(
  '[Facture] Load Factures Failure',
  props<{ error: string }>()
);

// 🔹 Ajouter une facture
export const addFacture = createAction(
  '[Facture] Add Facture',
  props<{ facture: Facture }>()
);
export const addFactureSuccess = createAction(
  '[Facture] Add Facture Success',
  props<{ facture: Facture }>()
);
export const addFactureFailure = createAction(
  '[Facture] Add Facture Failure',
  props<{ error: string }>()
);

// 🔹 Mettre à jour une facture
export const updateFacture = createAction(
  '[Facture] Update Facture',
  props<{ facture: Facture }>()
);
export const updateFactureSuccess = createAction(
  '[Facture] Update Facture Success',
  props<{ facture: Facture }>()
);
export const updateFactureFailure = createAction(
  '[Facture] Update Facture Failure',
  props<{ error: string }>()
);

// 🔹 Supprimer une facture
export const deleteFacture = createAction(
  '[Facture] Delete Facture',
  props<{ factureId: number }>()
);
export const deleteFactureSuccess = createAction(
  '[Facture] Delete Facture Success',
  props<{ factureId: number }>()
);
export const deleteFactureFailure = createAction(
  '[Facture] Delete Facture Failure',
  props<{ error: string }>()
);
