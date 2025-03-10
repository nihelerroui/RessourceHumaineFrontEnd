import { createReducer, on } from '@ngrx/store';
import * as SocieteActions from './societe.actions';
import { Societe } from './societe.models';

export interface SocieteState {
  societes: Societe[];
  loading: boolean;
  error: string | null;
}

export const initialState: SocieteState = {
  societes: [],
  loading: false,
  error: null
};

export const societeReducer = createReducer(
  initialState,
  
  // Charger les sociétés
  on(SocieteActions.loadSocietes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SocieteActions.loadSocietesSuccess, (state, { societes }) => ({
    ...state,
    societes,
    loading: false
  })),
  on(SocieteActions.loadSocietesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Ajouter une société
  on(SocieteActions.addSocieteSuccess, (state, { societe }) => ({
    ...state,
    societes: [...state.societes, societe]
  })),
  on(SocieteActions.addSocieteFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Mettre à jour une société
  on(SocieteActions.updateSocieteSuccess, (state, { societe }) => ({
    ...state,
    societes: state.societes.map(s => s.societeId === societe.societeId ? societe : s)
  })),
  on(SocieteActions.updateSocieteFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Supprimer une société
  on(SocieteActions.deleteSocieteSuccess, (state, { societeId }) => ({
    ...state,
    societes: state.societes.filter(s => s.societeId !== societeId)
  })),
  on(SocieteActions.deleteSocieteFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
