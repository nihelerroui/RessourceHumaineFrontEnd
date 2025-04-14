// src/app/store/Prestation/prestation.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as PrestationActions from './prestation.action';

export interface PrestationState {
  prestations: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: PrestationState = {
  prestations: [],
  loading: false,
  error: null
};

export const prestationReducer = createReducer(
  initialState,
  // Load
  on(PrestationActions.loadPrestations, state => ({
    ...state, loading: true
  })),
  on(PrestationActions.loadPrestationsSuccess, (state, { prestations }) => ({
    ...state, prestations, loading: false
  })),
  on(PrestationActions.loadPrestationsFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  // Create
  on(PrestationActions.createPrestation, state => ({
    ...state, loading: true
  })),
  on(PrestationActions.createPrestationSuccess, (state, { prestation }) => ({
    ...state,
    prestations: [...state.prestations, prestation],
    loading: false
  })),
  on(PrestationActions.createPrestationFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),

  // Update
  on(PrestationActions.updatePrestation, state => ({
    ...state, loading: true
  })),
  on(PrestationActions.updatePrestationSuccess, (state, { prestation }) => ({
    ...state,
    prestations: state.prestations.map(p => p.prestationId === prestation.prestationId ? prestation : p),
    loading: false
  })),
  on(PrestationActions.updatePrestationFailure, (state, { error }) => ({
    ...state, error, loading: false
  })),
  // delete
  on(PrestationActions.deletePrestationSuccess, (state, { id }) => ({
    ...state,
    prestations: state.prestations.filter(prestation => prestation.prestationId !== id),
    loading: false
  })),
  on(PrestationActions.deletePrestationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);