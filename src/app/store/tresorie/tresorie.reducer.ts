import { Action, createReducer, on } from '@ngrx/store';
import { 
  loadTresorie, 
  loadTresorieSuccess, 
  loadTresorieFailure,
  setSoldeInitial,
  setSoldeInitialSuccess,
  setSoldeInitialFailure,
  validerPaiement,
  validerPaiementSuccess,
  validerPaiementFailure,
  augmenterSoldeActuel,
  augmenterSoldeActuelSuccess,
  augmenterSoldeActuelFailure
} from './tresorie.actions';
import { Tresorie } from '../../models/tresorie.model';

// 🔹 Interface pour le state de la trésorerie
export interface TresorieState {
  tresorie: Tresorie | null;  // ✅ Stocke toute la trésorerie
  loading: boolean;
  error: string | null;
}

// 🔹 État initial de la trésorerie
export const initialState: TresorieState = {
  tresorie: null,
  loading: false,
  error: null
};

// 🔹 Reducer NgRx
export const tresorieReducer = createReducer(
  initialState,

  // 🚀 Charger la trésorerie complète
  on(loadTresorie, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadTresorieSuccess, (state, { tresorie }) => ({
    ...state,
    tresorie, // ✅ Stocke toute la trésorerie, pas juste le solde
    loading: false
  })),
  on(loadTresorieFailure, (state, { error }) => ({
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
    tresorie, // ✅ Stocke toute la trésorerie mise à jour
    loading: false,
    error: null
  })),
  on(setSoldeInitialFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Valider un paiement et mettre à jour la trésorerie
  on(validerPaiement, (state) => ({
    ...state,
    loading: true
  })),
  on(validerPaiementSuccess, (state, { tresorie }) => ({
    ...state,
    tresorie, // ✅ Stocke toute la trésorerie après validation
    loading: false
  })),
  on(validerPaiementFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  // 🚀 Augmenter le solde actuel et les entrées totales
on(augmenterSoldeActuel, (state) => ({
  ...state,
  loading: true
})),
on(augmenterSoldeActuelSuccess, (state, { tresorie }) => ({
  ...state,
  tresorie, // ✅ Met à jour toute la trésorerie après augmentation
  loading: false,
  error: null
})),
on(augmenterSoldeActuelFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false
}))
);



// 🔹 Exporter le reducer
export function reducer(state: TresorieState | undefined, action: Action) {
  return tresorieReducer(state, action);
}
