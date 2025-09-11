import { createReducer, on } from '@ngrx/store';
import * as FactureAchatsActions  from './factureAchat.actions';
import { FactureAchat } from '../../models/factureAchat.model';

export interface FactureAchatState {
  factures: FactureAchat[];
  loading: boolean;
  error: string | null;
  fileUrl: string | null;
}

export const initialState: FactureAchatState = {
  factures: [],
  loading: false,
  error: null,
  fileUrl: null
};

export const factureAchatReducer = createReducer(
  initialState,
  on(FactureAchatsActions.loadFacturesAchat, (state) => ({ ...state, loading: true })),
  on(FactureAchatsActions.loadFacturesAchatSuccess, (state, { factures }) => ({ ...state, factures, loading: false })),
  on(FactureAchatsActions.loadFacturesAchatFailure, (state, { error }) => ({ ...state, error, loading: false })),
  
  on(FactureAchatsActions.addFactureAchat, (state) => ({ ...state, loading: true })),
  on(FactureAchatsActions.addFactureAchatSuccess, (state, { facture }) => ({
    ...state,
    factures: [...state.factures, facture],
    loading: false
  })),
  on(FactureAchatsActions.addFactureAchatFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(FactureAchatsActions.updateFactureAchat, (state) => ({ ...state, loading: true })),
  on(FactureAchatsActions.updateFactureAchatSuccess, (state, { facture }) => ({
    ...state,
    factures: state.factures.map(f => f.factureAchatId === facture.factureAchatId ? facture : f),
    loading: false
  })),
  on(FactureAchatsActions.updateFactureAchatFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(FactureAchatsActions.deleteFactureAchat, (state) => ({ ...state, loading: true })),
  on(FactureAchatsActions.deleteFactureAchatSuccess, (state, { factureAchatId }) => ({
    ...state,
    factures: state.factures.filter(f => f.factureAchatId !== factureAchatId),
    loading: false
  })),
  on(FactureAchatsActions.deleteFactureAchatFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(FactureAchatsActions.setFileUrl, (state, { fileUrl }) => ({
    ...state,
    fileUrl
  }))
);
