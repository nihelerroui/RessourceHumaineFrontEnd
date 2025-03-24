import { createReducer, on } from '@ngrx/store';
import {
  loadFactures,
  loadFacturesSuccess,
  loadFacturesFailure,
  addFacture,
  addFactureSuccess,
  addFactureFailure,
  updateFacture,
  updateFactureSuccess,
  updateFactureFailure,
  deleteFacture,
  deleteFactureSuccess,
  deleteFactureFailure,
  setFileUrl
} from './facture.actions';
import { Facture } from '../../models/facture.model';

export interface FactureState {
  factures: Facture[];
  loading: boolean;
  error: string | null;
  fileUrl: string | null;
}

export const initialState: FactureState = {
  factures: [],
  loading: false,
  error: null,
  fileUrl: null
};

export const factureReducer = createReducer(
  initialState,
  on(loadFactures, (state) => ({ ...state, loading: true })),
  on(loadFacturesSuccess, (state, { factures }) => ({ ...state, factures, loading: false })),
  on(loadFacturesFailure, (state, { error }) => ({ ...state, error, loading: false })),
  
  on(addFacture, (state) => ({ ...state, loading: true })),
  on(addFactureSuccess, (state, { facture }) => ({
    ...state,
    factures: [...state.factures, facture],
    loading: false
  })),
  on(addFactureFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(updateFacture, (state) => ({ ...state, loading: true })),
  on(updateFactureSuccess, (state, { facture }) => ({
    ...state,
    factures: state.factures.map(f => f.factureId === facture.factureId ? facture : f),
    loading: false
  })),
  on(updateFactureFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(deleteFacture, (state) => ({ ...state, loading: true })),
  on(deleteFactureSuccess, (state, { factureId }) => ({
    ...state,
    factures: state.factures.filter(f => f.factureId !== factureId),
    loading: false
  })),
  on(deleteFactureFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(setFileUrl, (state, { fileUrl }) => ({
    ...state,
    fileUrl
  }))
);
