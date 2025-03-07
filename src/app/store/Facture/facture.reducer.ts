import { createReducer, on } from '@ngrx/store';
import * as FactureActions from './facture.actions';

export interface FactureState {
  facture: any | null;
  loading: boolean;
  error: string | null;
}

export const initialState: FactureState = {
  facture: null,
  loading: false,
  error: null
};

export const factureReducer = createReducer(
  initialState,
  // Fetch Facture by ID
  on(FactureActions.fetchFactureById, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FactureActions.fetchFactureByIdSuccess, (state, { facture }) => ({
    ...state,
    facture,
    loading: false
  })),
  on(FactureActions.fetchFactureByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);