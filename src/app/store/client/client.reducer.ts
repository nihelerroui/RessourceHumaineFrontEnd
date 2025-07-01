import { Action, createReducer, on } from '@ngrx/store';
import { Client } from 'src/app/models/client.model';
import * as ClientActions from './client.actions';
import { ClientMetrics } from 'src/app/models/ClientMetrics.model';


export interface ClientState {
  clients: Client[];  
  loading: boolean;
  error: string | null;
  metrics: ClientMetrics[];
}


export const initialState: ClientState = {
  clients: [],  
  loading: false,
  error: null,
  metrics: []
};

export const clientReducer = createReducer(
  initialState,

 
  on(ClientActions.loadClients, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,  
    loading: false
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

 
  on(ClientActions.addClient, (state) => ({
    ...state,
    loading: true
  })),
  on(ClientActions.addClientSuccess, (state, { client }) => ({
    ...state,
    clients: [...state.clients, client],  
    loading: false
  })),
  on(ClientActions.addClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

 
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
  on(ClientActions.loadClientMetrics, (state) => ({
  ...state,
  loading: true,
  error: null
})),
on(ClientActions.loadClientMetricsSuccess, (state, { metrics }) => ({
  ...state,
  loading: false,
  metrics
})),
on(ClientActions.loadClientMetricsFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
})),

  
);

