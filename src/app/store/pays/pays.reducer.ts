import { Action, createReducer, on } from '@ngrx/store';
import {
  loadPays,
  loadPaysSuccess,
  loadPaysFailure,
  addPays,
  addPaysSuccess,
  addPaysFailure,
  updatePays,
  updatePaysSuccess,
  updatePaysFailure,
  deletePays,
  deletePaysSuccess,
  deletePaysFailure
} from './pays.actions';
import { Pays } from '../../models/pays.model';

// 🔹 Interface pour le state Pays
export interface PaysState {
  paysList: Pays[];
  loading: boolean;
  error: string | null;
}

// 🔹 État initial
export const initialState: PaysState = {
  paysList: [],
  loading: false,
  error: null
};

// 🔹 Reducer
export const paysReducer = createReducer(
  initialState,

  // 🚀 Charger les pays
  on(loadPays, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadPaysSuccess, (state, { paysList }) => ({
    ...state,
    paysList,
    loading: false
  })),
  on(loadPaysFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Ajouter un pays
  on(addPays, (state) => ({
    ...state,
    loading: true
  })),
  on(addPaysSuccess, (state, { pays }) => ({
    ...state,
    paysList: [...state.paysList, pays],
    loading: false
  })),
  on(addPaysFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Mettre à jour un pays
  on(updatePays, (state) => ({
    ...state,
    loading: true
  })),
  on(updatePaysSuccess, (state, { pays }) => ({
    ...state,
    paysList: state.paysList.map((p) => (p.paysId === pays.paysId ? pays : p)),
    loading: false
  })),
  on(updatePaysFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Supprimer un pays
  on(deletePays, (state) => ({
    ...state,
    loading: true
  })),
  on(deletePaysSuccess, (state, { paysId }) => ({
    ...state,
    paysList: state.paysList.filter((p) => p.paysId !== paysId),
    loading: false
  })),
  on(deletePaysFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

// 🔹 Exporter le reducer
export function reducer(state: PaysState | undefined, action: Action) {
  return paysReducer(state, action);
}
