import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FactureAchatState } from './factureAchat.reducer';


export const selectFactureState = createFeatureSelector<FactureAchatState>('factureAchat');


export const selectFactureList = createSelector(
  selectFactureState,
  (state) => state.factures
);


export const selectFactureLoading = createSelector(
  selectFactureState,
  (state) => state.loading
);

export const selectFactureError = createSelector(
  selectFactureState,
  (state) => state.error
);

export const selectFileUrl = createSelector(
  (state: any) => state.facture,
  (state) => state.fileUrl
);