import { createAction, props } from '@ngrx/store';
import { Client } from 'src/app/models/client.model';
import { ClientMetrics } from 'src/app/models/ClientMetrics.model';
import { Rentabilite } from 'src/app/models/Rentabilite.model';

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
// 🔹 Envoyer un email d'import
export const sendImportEmail = createAction(
  '[Client] Send Import Email',
  props<{ clientId: number }>()
);

export const sendImportEmailSuccess = createAction(
  '[Client] Send Import Email Success'
);

export const sendImportEmailFailure = createAction(
  '[Client] Send Import Email Failure',
  props<{ error: string }>()
);
// 📊 Charger les métriques client
export const loadClientMetrics = createAction(
  '[Client] Load Client Metrics'
);

export const loadClientMetricsSuccess = createAction(
  '[Client] Load Client Metrics Success',
  props<{ metrics: ClientMetrics[] }>()
);

export const loadClientMetricsFailure = createAction(
  '[Client] Load Client Metrics Failure',
  props<{ error: string }>()
);
// Charger la rentabilité d'un client
export const loadRentabilites = createAction(
  '[Client] Load Rentabilites',
  props<{ year: number, societeId: number | "" }>()
);

export const loadRentabilitesSuccess = createAction(
  '[Client] Load Rentabilites Success',
  props<{ rentabilites: Rentabilite[] }>()
);

export const loadRentabilitesFailure = createAction(
  '[Client] Load Rentabilites Failure',
  props<{ error: string }>()
);
