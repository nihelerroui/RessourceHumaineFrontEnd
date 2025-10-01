import { createReducer, on } from "@ngrx/store";
import * as ContratClientActions from "../contratClient/contratClient.actions";
import { ContratClient } from "../../models/contratClient.models";

export interface ContratClientState {
  contrats: ContratClient[];
  searchResults: ContratClient[];
  loading: boolean;
  error: string | null;
  nombreContratsRealises: number | null;
}

export const initialState: ContratClientState = {
  contrats: [],
  searchResults: [], 
  loading: false,
  error: null,
  nombreContratsRealises: 0
};

export const contratClientReducer = createReducer(
  initialState,

  on(ContratClientActions.loadContratsClient, state => ({
    ...state,
    loading: true,
  })),
  on(ContratClientActions.loadContratsClientSuccess, (state, { contrats }) => ({
    ...state,
    contrats,
    searchResults: contrats,
    loading: false,
    error: null,
  })),
  on(ContratClientActions.loadContratsClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContratClientActions.importerContratClient, state => ({
    ...state,
    loading: true,
  })),
  on(ContratClientActions.importerContratClientSuccess, (state, { contrat }) => ({
    ...state,
    contrats: contrat ? [...state.contrats, contrat] : [...state.contrats],
    loading: false,
    error: null,
  })),
  on(ContratClientActions.importerContratClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContratClientActions.loadContratsClientByClientId, state => ({
    ...state,
    loading: true,
  })),
  on(ContratClientActions.loadContratsClientByClientIdSuccess, (state, { contrats }) => ({
    ...state,
    contrats,
    searchResults: contrats,
    loading: false,
    error: null,
  })),
  on(ContratClientActions.loadContratsClientByClientIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ContratClientActions.updateContratClientSuccess, (state, { contrat }) => ({
    ...state,
    contrats: state.contrats.map(c =>
      c.contratClientId === contrat.contratClientId ? contrat : c
    ),
  })),
  on(ContratClientActions.updateContratClientFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ContratClientActions.loadContratsBySocieteAdmin, state => ({
  ...state,
  loading: true
})),

on(ContratClientActions.loadContratsBySocieteAdminSuccess, (state, { contrats }) => ({
  ...state,
  contrats,
  loading: false,
  error: null
})),

on(ContratClientActions.loadContratsBySocieteAdminFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
})),
on(ContratClientActions.deleteContratClient, (state) => ({ ...state, loading: true })),
  on(ContratClientActions.deleteContratClientSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    contrats: state.contrats.filter(c => c.contratClientId !== id),
  })),
  on(ContratClientActions.deleteContratClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
