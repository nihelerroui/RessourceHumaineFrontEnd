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
  on(PrestationActions.fetchPrestationData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PrestationActions.fetchPrestationDataSuccess, (state, { prestations }) => ({
    ...state,
    prestations,
    loading: false
  })),
  on(PrestationActions.fetchPrestationDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
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