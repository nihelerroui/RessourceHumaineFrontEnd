import { createReducer, on } from '@ngrx/store';
import { HistoriqueChiffreAffaire } from '../../models/HistoriqueChiffreAffaire.model';
import * as ChiffreAffaireActions from '../ChiffreAffaire/ChiffreAffaire.actions';

// 1. Interface de l'état
export interface ChiffreAffaireState {
  historique: HistoriqueChiffreAffaire[];
  totalByClient: { [clientId: number]: number };
  totalPayeesByClient: { [clientId: number]: number };
  loading: boolean;
  error: string | null;
  caDeuxAnsAvant: number;
  caAnneePrecedente: number;
}

// 2. État initial
export const initialState: ChiffreAffaireState = {
  historique: [],
  totalByClient: {},
  totalPayeesByClient: {},
  loading: false,
  error: null,
  caAnneePrecedente: 0,
  caDeuxAnsAvant: 0,
};

export const chiffreAffaireReducer = createReducer(
  initialState,

  // Load historique
  on(ChiffreAffaireActions.loadChiffreAffaire, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ChiffreAffaireActions.loadChiffreAffaireSuccess, (state, { chiffres }) => ({
    ...state,
    historique: chiffres,
    loading: false
  })),
  on(ChiffreAffaireActions.loadChiffreAffaireFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load total factures
  on(ChiffreAffaireActions.loadTotalFactures, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ChiffreAffaireActions.loadTotalFacturesSuccess, (state, { clientId, total }) => ({
    ...state,
    totalByClient: {
      ...state.totalByClient,
      [clientId]: total
    },
    loading: false
  })),
  on(ChiffreAffaireActions.loadTotalFacturesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // ✅ Load total factures payées par client
  on(ChiffreAffaireActions.loadTotalFacturesPayees, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ChiffreAffaireActions.loadTotalFacturesPayeesSuccess, (state, { clientId, totalPayees }) => ({
    ...state,
    totalPayeesByClient: {
      ...state.totalPayeesByClient,
      [clientId]: totalPayees
    },
    loading: false
  })),
  on(ChiffreAffaireActions.loadTotalFacturesPayeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(ChiffreAffaireActions.loadChiffreAffaireDeuxDernieresAnneesSuccess, (state, { caAnneePrecedente, caDeuxAnsAvant }) => ({
  ...state,
  caAnneePrecedente,
  caDeuxAnsAvant,
  loading: false,
  error: null
})),

on(ChiffreAffaireActions.loadChiffreAffaireDeuxDernieresAnneesFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false
}))


);
