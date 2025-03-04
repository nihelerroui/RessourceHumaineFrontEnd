import { createReducer, on } from '@ngrx/store';
import * as DepenseActions from './depense.actions';
import { Depense } from '../../shared/models/depense.model';

export interface DepenseState {
  depenses: Depense[];
  loading: boolean;
  error: string | null;
}

export const initialState: DepenseState = {
  depenses: [],
  loading: false,
  error: null,
};

export const depenseReducer = createReducer(
  initialState,
  // Fetch
  on(DepenseActions.fetchDepenseData, (state) => ({ ...state, loading: true })),
  on(DepenseActions.fetchDepenseSuccess, (state, { depenses }) => ({
    ...state,
    depenses,
    loading: false,
  })),
  on(DepenseActions.fetchDepenseFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create
  on(DepenseActions.createDepense, (state) => ({ ...state, loading: true })),
  on(DepenseActions.createDepenseSuccess, (state, { depense }) => ({
    ...state,
    depenses: [...state.depenses, depense],
    loading: false,
  })),
  on(DepenseActions.createDepenseFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Update
  on(DepenseActions.updateDepense, (state) => ({ ...state, loading: true })),
  on(DepenseActions.updateDepenseSuccess, (state, { depense }) => ({
    ...state,
    depenses: state.depenses.map((d) =>
      d.depenseId === depense.depenseId ? depense : d
    ),
    loading: false,
  })),
  on(DepenseActions.updateDepenseFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Delete
  on(DepenseActions.deleteDepense, (state) => ({ ...state, loading: true })),
  on(DepenseActions.deleteDepenseSuccess, (state, { id }) => ({
    ...state,
    depenses: state.depenses.filter((d) => d.depenseId !== id),
    loading: false,
  })),
  on(DepenseActions.deleteDepenseFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);