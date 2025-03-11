import { createReducer, on } from "@ngrx/store";
import * as ContratClientActions from "../contratClient/contratClient.actions";
import { ContratClient } from "../../models/contratClient.models";

export interface ContratClientState {
  contrats: ContratClient[];
  loading: boolean;
  error: string | null;
}

export const initialState: ContratClientState = {
  contrats: [],
  loading: false,
  error: null,
};

export const contratClientReducer = createReducer(
  initialState,

  // Charger les contrats clients
  on(ContratClientActions.loadContratsClient, (state) => ({
    ...state,
    loading: true,
  })),
  on(ContratClientActions.loadContratsClientSuccess, (state, { contrats }) => ({
    ...state,
    contrats,
    loading: false,
    error: null,
  })),
  on(ContratClientActions.loadContratsClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Importer un contrat client
  on(ContratClientActions.importerContratClient, (state) => {
    console.log("Reducer: Action importerContratClient reçue !");
    return { ...state, loading: true };
  }),
  
  on(ContratClientActions.importerContratClientSuccess, (state, { contrat }) => ({
    ...state,
    contrats: [...state.contrats, contrat],
    loading: false,
    error: null,
  })),
  on(ContratClientActions.importerContratClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
