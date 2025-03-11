import { Action, createReducer, on } from '@ngrx/store';
import { 
  loadSoldeTresorie, 
  loadSoldeTresorieSuccess, 
  loadSoldeTresorieFailure,
  setSoldeInitial,
  setSoldeInitialSuccess,
  setSoldeInitialFailure,
  validerPaiement,
  validerPaiementSuccess,
  validerPaiementFailure
} from './tresorie.actions';
import { Tresorie } from './tresorie.model';

// 🔹 Interface pour le state de la trésorerie
export interface TresorieState {
  tresorie: Tresorie | null;
  solde: number;
  loading: boolean;
  error: string | null;
}

// 🔹 État initial de la trésorerie
export const initialState: TresorieState = {
  tresorie: null,
  solde: 0,
  loading: false,
  error: null
};

// 🔹 Reducer NgRx
export const tresorieReducer = createReducer(
  initialState,

  // 🚀 Charger le solde actuel
  on(loadSoldeTresorie, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadSoldeTresorieSuccess, (state, { solde }) => ({
    ...state,
    solde,
    loading: false
  })),
  on(loadSoldeTresorieFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Définir le solde initial
  on(setSoldeInitial, (state) => ({
    ...state,
    loading: true
  })),
  on(setSoldeInitialSuccess, (state, { tresorie }) => ({
    ...state,
    tresorie,
    solde: tresorie.montant, // Mettre à jour le solde avec la valeur définie
    loading: false
  })),
  on(setSoldeInitialFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Valider un paiement
  on(validerPaiement, (state) => ({
    ...state,
    loading: true
  })),
  on(validerPaiementSuccess, (state, { solde }) => ({
    ...state,
    solde, // Mettre à jour le solde après validation du paiement
    loading: false
  })),
  on(validerPaiementFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

// 🔹 Exporter le reducer
export function reducer(state: TresorieState | undefined, action: Action) {
  return tresorieReducer(state, action);
}
