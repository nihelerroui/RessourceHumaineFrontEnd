import { Action, createReducer, on } from '@ngrx/store';
import { Facture } from '../../pages/models/facture.model';
import {
  loadFactures,
  loadFacturesSuccess,
  loadFacturesFailure,
  addFacture,
  addFactureSuccess,
  addFactureFailure,
  updateFacture,
  updateFactureSuccess,
  updateFactureFailure,
  deleteFacture,
  deleteFactureSuccess,
  deleteFactureFailure
} from './facture.actions';

// 🔹 Interface pour le state Facture
export interface FactureState {
  factures: Facture[];
  loading: boolean;
  error: string | null;
}

// 🔹 État initial
export const initialState: FactureState = {
  factures: [],
  loading: false,
  error: null
};

// 🔹 Reducer
export const factureReducer = createReducer(
  initialState,

  // 🚀 Charger les factures
  on(loadFactures, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadFacturesSuccess, (state, { factures }) => ({
    ...state,
    factures,
    loading: false
  })),
  on(loadFacturesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Ajouter une facture
  on(addFacture, (state) => ({
    ...state,
    loading: true
  })),
  on(addFactureSuccess, (state, { facture }) => ({
    ...state,
    factures: [...state.factures, facture],
    loading: false
  })),
  on(addFactureFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Mettre à jour une facture
  on(updateFacture, (state) => ({
    ...state,
    loading: true
  })),
  on(updateFactureSuccess, (state, { facture }) => ({
    ...state,
    factures: state.factures.map((f) => (f.factureId === facture.factureId ? facture : f)),
    loading: false
  })),
  on(updateFactureFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Supprimer une facture
  on(deleteFacture, (state) => ({
    ...state,
    loading: true
  })),
  on(deleteFactureSuccess, (state, { factureId }) => ({
    ...state,
    factures: state.factures.filter((f) => f.factureId !== factureId),
    loading: false
  })),
  on(deleteFactureFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

// 🔹 Exporter le reducer
export function reducer(state: FactureState | undefined, action: Action) {
  return factureReducer(state, action);
}
