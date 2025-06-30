import { createReducer, on } from '@ngrx/store';
import { Recette } from 'src/app/models/recette.models';
import * as RecetteActions from './recette.actions';

export interface RecetteState {
  recettes: Recette[];
  loading: boolean;
  error: any;
}

export const initialState: RecetteState = {
  recettes: [],
  loading: false,
  error: null,
};

export const recetteReducer = createReducer(
  initialState,
  on(RecetteActions.loadRecettes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RecetteActions.loadRecettesSuccess, (state, { recettes }) => ({
    ...state,
    loading: false,
    recettes
  })),
  on(RecetteActions.loadRecettesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(RecetteActions.loadRecettesBySociete, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(RecetteActions.loadRecettesBySocieteSuccess, (state, { recettes }) => ({
    ...state,
    recettes,
    loading: false
  })),

  on(RecetteActions.loadRecettesBySocieteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
