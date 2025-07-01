import { createReducer, on } from '@ngrx/store';
import * as FactureClientActions from './factureclient.actions';
import { Prestation } from 'src/app/models/prestation.model';

export interface FactureClientState {
  factureClients: any[];
  prestationsByContrat: Prestation[];
  facturePreview: any | null;
  loading: boolean;
  error: string | null;
  factureSelected: any | null;
  nbFacturesValider: number;
  nbFacturesValiderMoisPrecedent: number;
}

export const initialState: FactureClientState = {
  factureClients: [],
  prestationsByContrat: [],
  facturePreview: null,
  loading: false,
  error: null,
  factureSelected: null,
  nbFacturesValider: 0,
  nbFacturesValiderMoisPrecedent: 0
};

export const factureClientReducer = createReducer(
  initialState,
  // Load
  on(FactureClientActions.loadFacturesClient, (state) => ({ ...state, loading: true })),
  on(FactureClientActions.loadFacturesClientSuccess, (state, { factures }) => ({
    ...state,
    factureClients: factures,
    loading: false
  })),
  on(FactureClientActions.loadFacturesClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
 // --- Load prestations by contrat ---
on(FactureClientActions.loadPrestationsByContrat, (state) => ({
  ...state,
  loading: true,
  error: null
})),

on(FactureClientActions.loadPrestationsByContratSuccess, (state, { prestations }) => ({
  ...state,
  prestationsByContrat: prestations,
  loading: false
})),

on(FactureClientActions.loadPrestationsByContratFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
})),
  // Create
  on(FactureClientActions.createFactureClientSuccess, (state, { facture }) => ({
    ...state,
    factureClients: [...state.factureClients, facture]
  })),
  // Update
  on(FactureClientActions.updateFactureClientSuccess, (state, { facture }) => ({
    ...state,
    factureClients: state.factureClients.map(f =>
      f.factureClientId === facture.factureClientId ? facture : f
    )
  })),
  // facture by id
  on(FactureClientActions.loadFactureClientByIdSuccess, (state, { facture }) => ({
    ...state,
    factureSelected: facture,
    loading: false,
  })),
  on(FactureClientActions.loadFactureClientByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(FactureClientActions.deleteFactureClientSuccess, (state, { factureClientId }) => ({
    ...state,
    factureClients: state.factureClients.filter(facture => facture.factureClientId !== factureClientId),
    loading: false,
    error: null
  })),
  // récupérer par clientId
  on(FactureClientActions.loadFacturesClientByClientId, (state) => ({
    ...state,
    loading: true
  })),

  on(FactureClientActions.loadFacturesClientByClientIdSuccess, (state, { factures }) => ({
    ...state,
    factureClients: factures,
    loading: false,
    error: null
  })),

  on(FactureClientActions.loadFacturesClientByClientIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // statut Confirmé_Admin & Confirmation_Complet
  on(FactureClientActions.loadFacturesValideesByClientId, (state) => ({
    ...state,
    loading: true,
  })),
  on(FactureClientActions.loadFacturesValideesByClientIdSuccess, (state, { factures }) => ({
    ...state,
    factureClients: factures,
    loading: false,
    total: factures.length,
  })),
  on(FactureClientActions.loadFacturesValideesByClientIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  //statut rejetee
  on(FactureClientActions.loadFacturesRejeteesByClientId, (state) => ({
    ...state,
    loading: true,
  })),
  on(FactureClientActions.loadFacturesRejeteesByClientIdSuccess, (state, { factures }) => ({
    ...state,
    factureClients: factures,
    loading: false,
    total: factures.length,
  })),
  on(FactureClientActions.loadFacturesRejeteesByClientIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  //statut non_payee
  on(FactureClientActions.loadFacturesNonPayeesByClientIdSuccess, (state, { factures }) => ({
    ...state,
    loading: false,
    factureClients: factures,
    error: null,
    total: factures.length
  })),

  on(FactureClientActions.loadFacturesNonPayeesByClientIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(FactureClientActions.loadFacturesBySocieteAdmin, (state) => ({
  ...state,
  loading: true,
})),
//loadFacturesBySocieteAdmin
on(FactureClientActions.loadFacturesBySocieteAdminSuccess, (state, { factures }) => ({
  ...state,
  factureClients: factures,
  loading: false,
  total: factures.length,
})),

on(FactureClientActions.loadFacturesBySocieteAdminFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false,
})),
on(FactureClientActions.loadNbFacturesValiderSuccess, (state, { count }) => ({
  ...state,
  nbFacturesValider: count,
  loading: false
})),

on(FactureClientActions.loadNbFacturesValiderFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false
})),
on(FactureClientActions.loadNbFacturesValiderMoisPrecedentSuccess, (state, { count }) => ({
  ...state,
  nbFacturesValiderMoisPrecedent: count,
  loading: false
})),

on(FactureClientActions.loadNbFacturesValiderMoisPrecedentFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false
})),


);