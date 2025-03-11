import { Action, createReducer, on } from '@ngrx/store';
import { Client } from 'src/app/models/client.model';
import {
  loadClients,
  loadClientsSuccess,
  loadClientsFailure,
  addClient,
  addClientSuccess,
  addClientFailure,
  updateClient,
  updateClientSuccess,
  updateClientFailure,
  deleteClient,
  deleteClientSuccess,
  deleteClientFailure
} from './client.actions';

// 🔹 Interface pour le state Client
export interface ClientState {
  clients: Client[];  // 🔥 Assure-toi que c'est bien "clients" et non "clientList"
  loading: boolean;
  error: string | null;
}

// 🔹 État initial
export const initialState: ClientState = {
  clients: [],  // 🔥 Assure-toi d'utiliser "clients" ici aussi
  loading: false,
  error: null
};

// 🔹 Reducer
export const clientReducer = createReducer(
  initialState,

  // 🚀 Charger les clients
  on(loadClients, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,  // 🔥 Vérifie que tu utilises "clients"
    loading: false
  })),
  on(loadClientsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Ajouter un client
  on(addClient, (state) => ({
    ...state,
    loading: true
  })),
  on(addClientSuccess, (state, { client }) => ({
    ...state,
    clients: [...state.clients, client],  // 🔥 Vérifie "clients"
    loading: false
  })),
  on(addClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Mettre à jour un client
  on(updateClient, (state) => ({
    ...state,
    loading: true
  })),
  on(updateClientSuccess, (state, { client }) => ({
    ...state,
    clients: state.clients.map((c) => (c.clientId === client.clientId ? client : c)),
    loading: false
  })),
  on(updateClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // 🚀 Supprimer un client
  on(deleteClient, (state) => ({
    ...state,
    loading: true
  })),
  on(deleteClientSuccess, (state, { clientId }) => ({
    ...state,
    clients: state.clients.filter((c) => c.clientId !== clientId),
    loading: false
  })),
  on(deleteClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

// 🔹 Exporter le reducer
export function reducer(state: ClientState | undefined, action: Action) {
  return clientReducer(state, action);
}
