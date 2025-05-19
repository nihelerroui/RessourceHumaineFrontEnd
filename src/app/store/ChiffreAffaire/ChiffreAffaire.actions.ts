import { createAction, props } from '@ngrx/store';
import { HistoriqueChiffreAffaire } from '../../models/HistoriqueChiffreAffaire.model';

// Charger l'historique du chiffre d'affaire
export const loadChiffreAffaire = createAction(
  '[Chiffre Affaire] Load Historique'
);

export const loadChiffreAffaireSuccess = createAction(
  '[Chiffre Affaire] Load Historique Success',
  props<{ historique: HistoriqueChiffreAffaire[] }>()
);

export const loadChiffreAffaireFailure = createAction(
  '[Chiffre Affaire] Load Historique Failure',
  props<{ error: any }>()
);

// Charger le montant total des factures
export const getTotalFactures = createAction(
  '[Chiffre Affaire] Get Total Factures',
  props<{ clientId: number }>()
);

export const getTotalFacturesSuccess = createAction(
  '[Chiffre Affaire] Get Total Factures Success',
  props<{ montantTotal: number }>()
);

export const getTotalFacturesFailure = createAction(
  '[Chiffre Affaire] Get Total Factures Failure',
  props<{ error: any }>()
);

// Charger le montant total des factures payées
export const getTotalFacturesPayees = createAction(
  '[Chiffre Affaire] Get Total Factures Payees',
  props<{ clientId: number }>()
);

export const getTotalFacturesPayeesSuccess = createAction(
  '[Chiffre Affaire] Get Total Factures Payees Success',
  props<{ montantTotalPayees: number }>()
);

export const getTotalFacturesPayeesFailure = createAction(
  '[Chiffre Affaire] Get Total Factures Payees Failure',
  props<{ error: any }>()
);
export const resetMontants = createAction('[Chiffre Affaire] Reset Montants');
