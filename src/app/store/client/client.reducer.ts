import { Action, createReducer, on } from '@ngrx/store';
import { Client } from 'src/app/models/client.model';
import * as ClientActions from './client.actions';

// 🔹 Interface pour le state Client
export interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

// 🔹 État initial
export const initialState: ClientState = {
  clients: [],  
  loading: false,
  error: null
};

// 🔹 Reducer
export const clientReducer = createReducer(
  initialState,

  // 🚀 Charger les clients
  on(ClientActions.loadClients, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,  // 🔥 Vérifie que tu utilises "clients"
    loading: false
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Ajouter un client
  on(ClientActions.addClient, (state) => ({
    ...state,
    loading: true
  })),
  on(ClientActions.addClientSuccess, (state, { client }) => ({
    ...state,
    clients: [...state.clients, client],  // 🔥 Vérifie "clients"
    loading: false
  })),
  on(ClientActions.addClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Mettre à jour un client
  on(ClientActions.updateClient, (state) => ({
    ...state,
    loading: true
  })),
  on(ClientActions.updateClientSuccess, (state, { client }) => ({
    ...state,
    clients: state.clients.map((c) => (c.clientId === client.clientId ? client : c)),
    loading: false
  })),
  on(ClientActions.updateClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Supprimer un client
  on(ClientActions.deleteClient, (state) => ({
    ...state,
    loading: true
  })),
  on(ClientActions.deleteClientSuccess, (state, { clientId }) => ({
    ...state,
    clients: state.clients.filter((c) => c.clientId !== clientId),
    loading: false
  })),
  on(ClientActions.deleteClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ClientActions.sendImportEmail, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientActions.sendImportEmailSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(ClientActions.sendImportEmailFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(ClientActions.loadClientsBySocieteAdminSuccess, (state, { clients }) => ({
  ...state,
  clients,
  loading: false
})),
on(ClientActions.loadClientsBySocieteAdminFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false
}))
);

export function reducer(state: ClientState | undefined, action: Action) {
  return clientReducer(state, action);
}

