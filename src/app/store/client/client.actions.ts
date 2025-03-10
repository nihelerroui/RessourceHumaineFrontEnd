import { createAction, props } from '@ngrx/store';
import { Client } from './client.model';

// 🔹 Charger la liste des clients
export const loadClients = createAction('[Client] Load Clients');
export const loadClientsSuccess = createAction(
  '[Client] Load Clients Success',
  props<{ clients: Client[] }>()
);
export const loadClientsFailure = createAction(
  '[Client] Load Clients Failure',
  props<{ error: string }>()
);

// 🔹 Ajouter un client
export const addClient = createAction(
  '[Client] Add Client',
  props<{ client: Client }>()
);
export const addClientSuccess = createAction(
  '[Client] Add Client Success',
  props<{ client: Client }>()
);
export const addClientFailure = createAction(
  '[Client] Add Client Failure',
  props<{ error: string }>()
);

// 🔹 Mettre à jour un client
export const updateClient = createAction(
  '[Client] Update Client',
  props<{ client: Client }>()
);
export const updateClientSuccess = createAction(
  '[Client] Update Client Success',
  props<{ client: Client }>()
);
export const updateClientFailure = createAction(
  '[Client] Update Client Failure',
  props<{ error: string }>()
);

// 🔹 Supprimer un client
export const deleteClient = createAction(
  '[Client] Delete Client',
  props<{ clientId: number }>()
);
export const deleteClientSuccess = createAction(
  '[Client] Delete Client Success',
  props<{ clientId: number }>()
);
export const deleteClientFailure = createAction(
  '[Client] Delete Client Failure',
  props<{ error: string }>()
);
