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
    contrats: contrat ? [...state.contrats, contrat] : [...state.contrats],
    loading: false,
    error: null,
  })),
  
  on(ContratClientActions.importerContratClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
   // Charger les contrats client par token
   on(ContratClientActions.loadContratsClientByToken, (state) => {
    console.log("✅ Reducer exécuté côté client !");
    return {
      ...state,
      loading: true,
    };
  }),
  on(ContratClientActions.loadContratsClientByTokenSuccess, (state, { contrats }) => {
    console.log('✅ Reducer appelé : loadContratsClientByTokenSuccess', contrats); // ← ici
    return {
      ...state,
      contrats,
      loading: false,
      error: null
    };
  }),
  
  on(ContratClientActions.loadContratsClientByTokenFailure, (state, { error }) => {
    console.log("❌ Reducer: loadContratsClientByTokenFailure", error);
    return {
      ...state,
      loading: false,
      error,
    };
  })

);
