import { Action, createReducer, on } from '@ngrx/store';
import * as TresorieActions from './tresorie.actions';
import { Tresorie } from '../../models/tresorie.model';
import { ScoreSante } from 'src/app/models/ScoreSante.model';
import { Societe } from 'src/app/models/societe.model';


export interface TresorieState {
  tresorie: Tresorie | null;  
  loading: boolean;
  error: string | null;
  score: ScoreSante | null;
  societe?: Societe;
}


export const initialState: TresorieState = {
  score: null,
  tresorie: null,
  loading: false,
  error: null
};

export const tresorieReducer = createReducer(
  initialState,

  on(TresorieActions.loadTresorie, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TresorieActions.loadTresorieSuccess, (state, { tresorie }) => ({
    ...state,
    tresorie, 
    loading: false
  })),
  on(TresorieActions.loadTresorieFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),


  on(TresorieActions.setSoldeInitial, (state) => ({
    ...state,
    loading: true
  })),
  on(TresorieActions.setSoldeInitialSuccess, (state, { tresorie }) => ({
    ...state,
    tresorie, 
    loading: false,
    error: null
  })),
  on(TresorieActions.setSoldeInitialFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),


  on(TresorieActions.validerPaiement, (state) => ({
    ...state,
    loading: true
  })),
  on(TresorieActions.validerPaiementSuccess, (state, { tresorie }) => ({
    ...state,
    tresorie, 
    loading: false
  })),
  on(TresorieActions.validerPaiementFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
 
on(TresorieActions.augmenterSoldeActuel, (state) => ({
  ...state,
  loading: true
})),
on(TresorieActions.augmenterSoldeActuelSuccess, (state, { tresorie }) => ({
  ...state,
  tresorie, 
  loading: false,
  error: null
})),
on(TresorieActions.augmenterSoldeActuelFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false
})),
on(TresorieActions.loadScoreSante, (state) => ({ ...state, loading: true, error: null })),
  on(TresorieActions.loadScoreSanteSuccess, (state, { score }) => ({
    ...state,
    loading: false,
    score
  })),
  on(TresorieActions.loadScoreSanteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);


export function reducer(state: TresorieState | undefined, action: Action) {
  return tresorieReducer(state, action);
}
