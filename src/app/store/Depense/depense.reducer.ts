import { createReducer, on } from '@ngrx/store';
import * as DepenseActions from './depense.actions';

export interface DepenseState {
  depenses: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: DepenseState = {
  depenses: [],
  loading: false,
  error: null
};

export const depenseReducer = createReducer(
  initialState,
  on(DepenseActions.fetchDepenseData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DepenseActions.fetchDepenseDataSuccess, (state, { depenses }) => ({
    ...state,
    depenses,
    loading: false
  })),
  on(DepenseActions.fetchDepenseDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
);
