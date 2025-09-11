import { createReducer, on } from '@ngrx/store';
import * as TresorerieActions from './tresorerie.actions';
import { Tresorerie } from 'src/app/models/Tresorerie.model';

export interface TresorerieState {
  tresorerie: Tresorerie | null;
  loading: boolean;
  error: any;
}

export const initialState: TresorerieState = {
  tresorerie: null,
  loading: false,
  error: null
};

export const tresorerieReducer = createReducer(
  initialState,

  on(TresorerieActions.loadTresorerie, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TresorerieActions.loadTresorerieSuccess, (state, { tresorerie }) => ({
    ...state,
    loading: false,
    tresorerie
  })),
  on(TresorerieActions.loadTresorerieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(TresorerieActions.createTresorerie, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TresorerieActions.createTresorerieSuccess, (state, { tresorerie }) => ({
    ...state,
    loading: false,
    tresorerie
  })),
  on(TresorerieActions.createTresorerieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
