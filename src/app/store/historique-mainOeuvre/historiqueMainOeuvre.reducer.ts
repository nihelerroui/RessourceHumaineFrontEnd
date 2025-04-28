import { createReducer, on } from '@ngrx/store';
import * as HistoriqueActions from './historiqueMainOeuvre.actions';
import { HistoriqueMainOeuvre } from 'src/app/models/historique-mainOeuvre'; 

export interface HistoriqueMainOeuvreState {
  data: HistoriqueMainOeuvre[];
  loading: boolean;
  error: string | null;
}

export const initialState: HistoriqueMainOeuvreState = {
  data: [],
  loading: false,
  error: null,
};

export const historiqueMainOeuvreReducer = createReducer(
  initialState,

  on(HistoriqueActions.loadHistoriqueMainOeuvre, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(HistoriqueActions.loadHistoriqueMainOeuvreSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false
  })),

  on(HistoriqueActions.loadHistoriqueMainOeuvreFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
