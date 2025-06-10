import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.reducer';


export const selectClientState = createFeatureSelector<ClientState>('client');


export const selectClientList = createSelector(
  selectClientState,
  (state: ClientState) => state.clients 
);

export const selectClientById = (clientId: number) =>
  createSelector(
    selectClientState,
    (state: ClientState) => state.clients.find((client) => client.clientId === clientId) 
  );


export const selectClientLoading = createSelector(
  selectClientState,
  (state: ClientState) => state.loading
);


export const selectClientError = createSelector(
  selectClientState,
  (state: ClientState) => state.error
);
