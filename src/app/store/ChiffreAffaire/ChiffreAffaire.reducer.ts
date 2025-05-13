import { createReducer, on } from '@ngrx/store';
import * as ChiffreAffaireActions from './ChiffreAffaire.actions';
import { HistoriqueChiffreAffaire } from '../../models/HistoriqueChiffreAffaire.model';

export interface ChiffreAffaireState {
  historique: HistoriqueChiffreAffaire[];
  montantTotal: number;
  montantTotalPayees: number;
  loading: boolean;
  error: any;
}

export const initialState: ChiffreAffaireState = {
  historique: [],
  montantTotal: 0,
  montantTotalPayees: 0,
  loading: false,
  error: null
};

export const chiffreAffaireReducer = createReducer(
  initialState,
  on(ChiffreAffaireActions.resetMontants, (state) => ({
    ...state,
    montantTotal: 0,
    montantTotalPayees: 0
  })),
  // Chargement de l'historique du chiffre d'affaire
  on(ChiffreAffaireActions.loadChiffreAffaire, (state) => ({
    ...state,
    loading: true
  })),
  on(ChiffreAffaireActions.loadChiffreAffaireSuccess, (state, { historique }) => ({
    ...state,
    loading: false,
    historique
  })),
  on(ChiffreAffaireActions.loadChiffreAffaireFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Chargement du montant total des factures
  on(ChiffreAffaireActions.getTotalFactures, (state) => ({
    ...state,
    loading: true
  })),
  on(ChiffreAffaireActions.getTotalFacturesSuccess, (state, { montantTotal }) => ({
    ...state,
    loading: false,
    montantTotal
  })),
  on(ChiffreAffaireActions.getTotalFacturesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Chargement du montant total des factures payées
  on(ChiffreAffaireActions.getTotalFacturesPayees, (state) => ({
    ...state,
    loading: true
  })),
  on(ChiffreAffaireActions.getTotalFacturesPayeesSuccess, (state, { montantTotalPayees }) => ({
    ...state,
    loading: false,
    montantTotalPayees
  })),
  on(ChiffreAffaireActions.getTotalFacturesPayeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
