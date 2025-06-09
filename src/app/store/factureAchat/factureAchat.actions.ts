import { createAction, props } from '@ngrx/store';
import { FactureAchat } from '../../models/factureAchat.model';


export const loadFacturesAchat = createAction('[FactureAchat] Load FacturesAchat');
export const loadFacturesAchatSuccess = createAction(
  '[FactureAchat] Load FacturesAchat Success',
  props<{ factures: FactureAchat[] }>()
);
export const loadFacturesAchatFailure = createAction(
  '[FactureAchat] Load Factures Failure',
  props<{ error: string }>()
);

export const addFactureAchat = createAction(
  '[FactureAchat] Add FactureAchat',
  props<{ facture: FormData }>()
);
export const addFactureAchatSuccess = createAction(
  '[FactureAchat] Add FactureAchat Success',
  props<{ facture: FactureAchat }>()
);
export const addFactureAchatFailure = createAction(
  '[FactureAchat] Add FactureAchat Failure',
  props<{ error: string }>()
);


export const updateFactureAchat = createAction(
  '[FactureAchat] Update FactureAchat',
  props<{ facture: FormData }>() 
);

export const updateFactureAchatSuccess = createAction(
  '[FactureAchat] Update FactureAchat Success',
  props<{ facture: FactureAchat }>()
);
export const updateFactureAchatFailure = createAction(
  '[FactureAchat] Update FactureAchat Failure',
  props<{ error: string }>()
);


export const deleteFactureAchat = createAction(
  '[FactureAchat] Delete FactureAchat',
  props<{ factureAchatId: number }>()
);
export const deleteFactureAchatSuccess = createAction(
  '[FactureAchat] Delete FactureAchat Success',
  props<{ factureAchatId: number }>()
);
export const deleteFactureAchatFailure = createAction(
  '[FactureAchat] Delete FactureAchat Failure',
  props<{ error: string }>()
);

export const setFileUrl = createAction(
  '[FactureAchat] Set File URL',
  props<{ fileUrl: string }>()
);