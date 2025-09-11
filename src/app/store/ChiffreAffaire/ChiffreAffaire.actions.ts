import { createAction, props } from '@ngrx/store';
import { HistoriqueChiffreAffaire } from 'src/app/models/HistoriqueChiffreAffaire.model';


export const loadChiffreAffaire = createAction(
  '[Chiffre Affaire] Load Historique'
);

export const loadChiffreAffaireSuccess = createAction(
  '[Chiffre Affaire] Load Historique Success',
  props<{ chiffres: HistoriqueChiffreAffaire[] }>()
);

export const loadChiffreAffaireFailure = createAction(
  '[Chiffre Affaire] Load Historique Failure',
  props<{ error: string }>()
);

// Chargement du montant total des factures
export const loadTotalFactures = createAction(
  '[Chiffre Affaire] Load Total Factures',
  props<{ clientId: number }>()
);

export const loadTotalFacturesSuccess = createAction(
  '[Chiffre Affaire] Load Total Factures Success',
  props<{ clientId: number; total: number }>() 
);

export const loadTotalFacturesFailure = createAction(
  '[Chiffre Affaire] Load Total Factures Failure',
  props<{ error: string }>()
);

// Chargement du montant total des factures payées
export const loadTotalFacturesPayees = createAction(
  '[Chiffre Affaire] Load Total Factures Payees',
  props<{ clientId: number }>()
);

export const loadTotalFacturesPayeesSuccess = createAction(
  '[Chiffre Affaire] Load Total Factures Payees Success',
  props<{ clientId: number; totalPayees: number }>()
);


export const loadTotalFacturesPayeesFailure = createAction(
  '[Chiffre Affaire] Load Total Factures Payees Failure',
  props<{ error: string }>()
);
//loadChiffreAffaireTrimestriel
export const loadChiffreAffaireDeuxDernieresAnnees = createAction(
  '[ChiffreAffaire] Load CA Deux Dernières Années'
);

export const loadChiffreAffaireDeuxDernieresAnneesSuccess = createAction(
  '[ChiffreAffaire] Load CA Deux Dernières Années Success',
  props<{ caAnneePrecedente: number; caDeuxAnsAvant: number }>()
);

export const loadChiffreAffaireDeuxDernieresAnneesFailure = createAction(
  '[ChiffreAffaire] Load CA Deux Dernières Années Failure',
  props<{ error: string }>()
);