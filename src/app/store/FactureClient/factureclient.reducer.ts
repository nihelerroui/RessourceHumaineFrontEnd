// src/app/store/factureclient/factureclient.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as FactureClientActions from './factureclient.actions';

export interface FactureClientState {
  factureClients: any[];
  facturePreview: any | null;
  loading: boolean;
  error: string | null;
}

export const initialState: FactureClientState = {
  factureClients: [],
  facturePreview: null,
  loading: false,
  error: null
};

export const factureClientReducer = createReducer(
  initialState,
  on(FactureClientActions.createFactureClient, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FactureClientActions.createFactureClientSuccess, (state, { factureClient }) => ({
    ...state,
    factureClients: [...state.factureClients, factureClient],
    loading: false
  })),
  on(FactureClientActions.createFactureClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(FactureClientActions.getFacturePreview, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FactureClientActions.getFacturePreviewSuccess, (state, { facturePreview }) => ({
    ...state,
    facturePreview,
    loading: false
  })),
  on(FactureClientActions.getFacturePreviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
);
