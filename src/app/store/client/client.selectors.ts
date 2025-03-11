import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.reducer';

// 🔹 Sélectionner l'état de la fonctionnalité "Client"
export const selectClientState = createFeatureSelector<ClientState>('client');

// 🔹 Sélectionner la liste complète des clients
export const selectClientList = createSelector(
  selectClientState,
  (state: ClientState) => state.clients  // 🔥 Correction ici
);

// 🔹 Sélectionner un client par son ID
export const selectClientById = (clientId: number) =>
  createSelector(
    selectClientState,
    (state: ClientState) => state.clients.find((client) => client.clientId === clientId)  // 🔥 Correction ici
  );

// 🔹 Sélectionner l'état de chargement
export const selectClientLoading = createSelector(
  selectClientState,
  (state: ClientState) => state.loading
);

// 🔹 Sélectionner les erreurs éventuelles
export const selectClientError = createSelector(
  selectClientState,
  (state: ClientState) => state.error
);
