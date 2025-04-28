import { createReducer, on } from '@ngrx/store';
import * as MainOeuvreActions from './mainOeuvre.actions';
import { MainOeuvre } from 'src/app/models/mainOeuvre.model';

export interface MainOeuvreState {
  data: MainOeuvre[];
  loading: boolean;
  error: string | null;
  verificationLoading: boolean;
}

export const initialState: MainOeuvreState = {
  data: [],
  loading: false,
  error: null,
  verificationLoading: false,
};

export const mainOeuvreReducer = createReducer(
  initialState,

  on(MainOeuvreActions.loadMainOeuvre, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MainOeuvreActions.loadMainOeuvreSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false
  })),
  on(MainOeuvreActions.loadMainOeuvreFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),


  on(MainOeuvreActions.verifierMiseAJourMainOeuvre, state => ({
    ...state,
    verificationLoading: true,
    error: null
  })),
  on(MainOeuvreActions.verifierMiseAJourMainOeuvreSuccess, state => ({
    ...state,
    verificationLoading: false
  })),
  on(MainOeuvreActions.verifierMiseAJourMainOeuvreFailure, (state, { error }) => ({
    ...state,
    verificationLoading: false,
    error
  }))
);
