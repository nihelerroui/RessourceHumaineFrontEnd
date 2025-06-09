import { createReducer, on } from '@ngrx/store';
import * as FactureActions from './factureSousTraitant.actions';
import { FactureSousTraitant } from 'src/app/models/FactureSousTraitant.model';

export interface FactureSousTraitantState {
  factures: FactureSousTraitant[];
  error: any;
  loading: boolean;
}

export const initialState: FactureSousTraitantState = {
  factures: [],
  error: null,
  loading: false
};

export const FactureSousTraitantReducer = createReducer(
  initialState,
  on(FactureActions.loadFacturesSousTraitant, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FactureActions.loadFacturesSousTraitantSuccess, (state, { factures }) => ({
    ...state,
    factures,
    loading: false
  })),
  on(FactureActions.loadFacturesSousTraitantFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
