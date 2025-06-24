import { createAction, props } from '@ngrx/store';
import { Tresorie } from '../../models/tresorie.model';
import { ScoreSante } from 'src/app/models/ScoreSante.model';


export const loadTresorie = createAction(
  '[Tresorie] Load Tresorie',
  props<{ societeId: number }>() 
);

export const loadTresorieSuccess = createAction(
  '[Tresorie] Load Tresorie Success',
  props<{ tresorie: Tresorie }>() 
);

export const loadTresorieFailure = createAction(
  '[Tresorie] Load Tresorie Failure',
  props<{ error: string }>()
);


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


export const validerPaiement = createAction(
  '[Tresorie] Valider Paiement',
  props<{ factureAchatId: number }>()
);

export const validerPaiementSuccess = createAction(
  '[Trésorie] Paiement validé avec succès',
  props<{ tresorie: Tresorie, factureAchatId: number }>() 
);



export const validerPaiementFailure = createAction(
  '[Trésorie] Paiement échoué',
  props<{ error: string }>()
);


export const augmenterSoldeActuel = createAction(
  '[Tresorie] Augmenter Solde',
  props<{ societeId: number; montant: number; source: string; motif: string }>()
);


export const augmenterSoldeActuelSuccess = createAction(
  '[Tresorie] Augmenter Solde Actuel Success',
  props<{ tresorie: Tresorie }>() 
);

export const augmenterSoldeActuelFailure = createAction(
  '[Tresorie] Augmenter Solde Actuel Failure',
  props<{ error: string }>()
);

export const loadScoreSante = createAction(
  '[SanteFinanciere] Load Score Sante',
  props<{ societeId: number; debut: string; fin: string }>()
);

export const loadScoreSanteSuccess = createAction(
  '[SanteFinanciere] Load Score Sante Success',
  props<{ score: ScoreSante }>()
);

export const loadScoreSanteFailure = createAction(
  '[SanteFinanciere] Load Score Sante Failure',
  props<{ error: string }>()
);
