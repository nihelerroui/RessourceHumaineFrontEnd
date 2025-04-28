import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { ClientService } from 'src/app/core/services/client.service';
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
  deleteClientFailure,
  sendImportEmailSuccess,
  sendImportEmailFailure,
  sendImportEmail
} from './client.actions';
import { Client } from 'src/app/models/client.model';

@Injectable()
export class ClientEffects {
  
  // 🔹 Effet pour charger la liste des clients
  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadClients),
      mergeMap(() =>
        this.clientService.getAll().pipe(
          map((clients: Client[]) => loadClientsSuccess({ clients })),
          catchError((error) => of(loadClientsFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour ajouter un client
  addClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addClient),
      mergeMap((action) =>
        this.clientService.create(action.client).pipe(
          map((newClient: Client) => addClientSuccess({ client: newClient })),
          catchError((error) => of(addClientFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour mettre à jour un client
  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateClient),
      mergeMap((action) =>
        this.clientService.update(action.client).pipe(
          map((updatedClient: Client) => updateClientSuccess({ client: updatedClient })),
          catchError((error) => of(updateClientFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour supprimer un client
  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteClient),
      mergeMap((action) =>
        this.clientService.delete(action.clientId).pipe(
          map(() => deleteClientSuccess({ clientId: action.clientId })),
          catchError((error) => of(deleteClientFailure({ error: error.message })))
        )
      )
    )
  );
  // 🔹 Envoyer email d'import de contrat
sendImportEmail$ = createEffect(() =>
  this.actions$.pipe(
    ofType(sendImportEmail),
    mergeMap((action) =>
      this.clientService.envoyerEmailImport(action.clientId).pipe(
        map(() => sendImportEmailSuccess()),
        catchError((error) =>
          of(sendImportEmailFailure({ error: error.message }))
        )
      )
    )
  )
);


  constructor(
    private actions$: Actions,
    private clientService: ClientService
  ) {}
}
