import { Action, createReducer, on } from '@ngrx/store';
import * as CaisseActions from './caisse.actions';
import { Caisse } from '../../models/caisse.model';
import { ScoreSante } from 'src/app/models/ScoreSante.model';
import { Societe } from 'src/app/models/societe.model';


export interface CaisseState {
  caisse: Caisse | null;  
  loading: boolean;
  error: string | null;
  score: ScoreSante | null;
  societe?: Societe;
}


export const initialState: CaisseState = {
  score: null,
  caisse: null,
  loading: false,
  error: null
};

export const caisseReducer = createReducer(
  initialState,

  on(CaisseActions.loadCaisse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CaisseActions.loadCaisseSuccess, (state, { caisse }) => ({
    ...state,
    caisse, 
    loading: false
  })),
  on(CaisseActions.loadCaisseFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),


  on(CaisseActions.setSoldeInitial, (state) => ({
    ...state,
    loading: true
  })),
  on(CaisseActions.setSoldeInitialSuccess, (state, { caisse }) => ({
    ...state,
    caisse, 
    loading: false,
    error: null
  })),
  on(CaisseActions.setSoldeInitialFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),


  on(CaisseActions.validerPaiement, (state) => ({
    ...state,
    loading: true
  })),
  on(CaisseActions.validerPaiementSuccess, (state, { caisse }) => ({
    ...state,
    caisse, 
    loading: false
  })),
  on(CaisseActions.validerPaiementFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
 
on(CaisseActions.augmenterSoldeActuel, (state) => ({
  ...state,
  loading: true
})),
on(CaisseActions.augmenterSoldeActuelSuccess, (state, { caisse }) => ({
  ...state,
  caisse, 
  loading: false,
  error: null
})),
on(CaisseActions.augmenterSoldeActuelFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false
})),
on(CaisseActions.loadScoreSante, (state) => ({ ...state, loading: true, error: null })),
  on(CaisseActions.loadScoreSanteSuccess, (state, { score }) => ({
    ...state,
    loading: false,
    score
  })),
  on(CaisseActions.loadScoreSanteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);


export function reducer(state: CaisseState | undefined, action: Action) {
  return caisseReducer(state, action);
}
