import { createReducer, on } from '@ngrx/store';
import * as MoisCritiqueActions from './mois-critique.actions';
import { MoisCritiqueResponse } from '../../core/services/mois_critique.service';

export interface MoisCritiqueState {
  data: MoisCritiqueResponse | null;
  loading: boolean;
  error: any;
}

export const initialState: MoisCritiqueState = {
  data: null,
  loading: false,
  error: null
};

export const moisCritiqueReducer = createReducer(
  initialState,
  on(MoisCritiqueActions.loadCriticalMonth, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MoisCritiqueActions.loadCriticalMonthSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false
  })),
  on(MoisCritiqueActions.loadCriticalMonthFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
