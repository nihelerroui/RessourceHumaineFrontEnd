import { createAction, props } from '@ngrx/store';
import { Caisse } from '../../models/caisse.model';
import { ScoreSante } from 'src/app/models/ScoreSante.model';


export const loadCaisse = createAction(
  '[Caisse] Load Caisse',
  props<{ societeId: number }>() 
);

export const loadCaisseSuccess = createAction(
  '[Caisse] Load Caisse Success',
  props<{ caisse : Caisse }>() 
);

export const loadCaisseFailure = createAction(
  '[Caisse] Load Caisse Failure',
  props<{ error: string }>()
);


export const setSoldeInitial = createAction(
  '[Caisse] Set Solde Initial',
  props<{ societeId: number; montant: number }>()
);

export const setSoldeInitialSuccess = createAction(
  '[Caisse] Set Solde Initial Success',
  props<{ caisse : Caisse }>() 
);

export const setSoldeInitialFailure = createAction(
  '[Caisse] Set Solde Initial Failure',
  props<{ error: string }>()
);


export const validerPaiement = createAction(
  '[Caisse] Valider Paiement',
  props<{ factureAchatId: number }>()
);

export const validerPaiementSuccess = createAction(
  '[Caisse] Paiement validé avec succès',
  props<{ caisse: Caisse, factureAchatId: number }>() 
);



export const validerPaiementFailure = createAction(
  '[Caisse] Paiement échoué',
  props<{ error: string }>()
);


export const augmenterSoldeActuel = createAction(
  '[Caisse] Augmenter Solde',
  props<{ societeId: number; montant: number; source: string; motif: string }>()
);


export const augmenterSoldeActuelSuccess = createAction(
  '[Caisse] Augmenter Solde Actuel Success',
  props<{ caisse: Caisse }>() 
);

export const augmenterSoldeActuelFailure = createAction(
  '[Caisse] Augmenter Solde Actuel Failure',
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
