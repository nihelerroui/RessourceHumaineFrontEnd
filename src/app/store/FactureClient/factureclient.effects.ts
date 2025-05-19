import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';

import * as FactureClientActions from './factureclient.actions';
import { FactureClientService } from '../../core/services/factureclient.service';

@Injectable()
export class FactureClientEffects {
  constructor(
    private actions$: Actions,
    private factureClientService: FactureClientService,
  ) { }

  //Load
  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.loadFacturesClient),
      mergeMap(() =>
        this.factureClientService.getAll().pipe(
          map((factures) => FactureClientActions.loadFacturesClientSuccess({ factures })),
          catchError((error) => of(FactureClientActions.loadFacturesClientFailure({ error })))
        )
      )
    )
  );
  //Create
  createFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.createFactureClient),
      mergeMap(({ facture }) =>
        this.factureClientService.createFactureClient(facture).pipe(
          map((created) => FactureClientActions.createFactureClientSuccess({ facture: created })),
          catchError((error) => of(FactureClientActions.createFactureClientFailure({ error })))
        )
      )
    )
  );
  //Update
  updateFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.updateFactureClient),
      mergeMap(({ facture }) => {
        console.log('🟡 FACTURE À METTRE À JOUR:', facture);

        return this.factureClientService.updateFactureClient(facture).pipe(
          map((updated) => {
            console.log('✅ FACTURE MISE À JOUR:', updated);
            return FactureClientActions.updateFactureClientSuccess({ facture: updated });
          }),
          catchError((error) => {
            console.error('❌ Erreur update:', error);
            return of(FactureClientActions.updateFactureClientFailure({ error }));
          })
        );
      })
    )
  );
  //loadFactureById
  loadFactureById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.loadFactureClientById),
      mergeMap(({ id }) =>
        this.factureClientService.getById(id).pipe(
          map((facture) => FactureClientActions.loadFactureClientByIdSuccess({ facture })),
          catchError((error) => of(FactureClientActions.loadFactureClientByIdFailure({ error })))
        )
      )
    )
  );
  //loadPrestationsByClient
  loadPrestationsByClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.loadPrestationsByClient),
      mergeMap(({ clientId }) =>
        this.factureClientService.getPrestationsByClient(clientId).pipe(
          map((prestations) =>
            FactureClientActions.loadPrestationsByClientSuccess({ prestations })
          ),
          catchError((error) =>
            of(FactureClientActions.loadPrestationsByClientFailure({ error }))
          )
        )
      )
    )
  );

  loadFacturesClientByClientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.loadFacturesClientByClientId),
      mergeMap(({ clientId }) =>
        this.factureClientService.getFacturesByClientId(clientId).pipe(
          map((factures) =>
            FactureClientActions.loadFacturesClientByClientIdSuccess({ factures })
          ),
          catchError((error) =>
            of(
              FactureClientActions.loadFacturesClientByClientIdFailure({
                error: error.message || "Erreur lors du chargement",
              })
            )
          )
        )
      )
    )
  );

  deleteFactureClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.deleteFactureClient),
      mergeMap(({ factureClientId }) =>
        this.factureClientService.delete(factureClientId).pipe(
          map(() => FactureClientActions.deleteFactureClientSuccess({ factureClientId })),
          catchError(error => of(FactureClientActions.deleteFactureClientFailure({ error })))
        )
      )
    )
  );

  loadFacturesValideesByClientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.loadFacturesValideesByClientId),
      mergeMap(({ clientId }) =>
        this.factureClientService.getFacturesByClientId(clientId).pipe(
          map((factures) => {
            const filtered = factures.filter(f =>
              f.statutFacture === 'Confirmé_Admin' || f.statutFacture === 'Confirmation_Complet'
            );
            return FactureClientActions.loadFacturesValideesByClientIdSuccess({ factures: filtered });
          }),
          catchError((error) =>
            of(FactureClientActions.loadFacturesValideesByClientIdFailure({ error }))
          )
        )
      )
    )
  );

  loadFacturesRejeteesByClientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.loadFacturesRejeteesByClientId),
      mergeMap(({ clientId }) =>
        this.factureClientService.getFacturesRejeteesByClientId(clientId).pipe(
          map(factures =>
            FactureClientActions.loadFacturesRejeteesByClientIdSuccess({ factures })
          ),
          catchError(error =>
            of(FactureClientActions.loadFacturesRejeteesByClientIdFailure({ error }))
          )
        )
      )
    )
  );

  loadFacturesNonPayeesByClientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.loadFacturesNonPayeesByClientId),
      mergeMap(({ clientId }) =>
        this.factureClientService.getFacturesNonPayeesByClientId(clientId).pipe(
          map(factures =>
            FactureClientActions.loadFacturesNonPayeesByClientIdSuccess({ factures })
          ),
          catchError(error =>
            of(FactureClientActions.loadFacturesNonPayeesByClientIdFailure({ error }))
          )
        )
      )
    )
  );

  envoyerEmailFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.envoyerEmailFacture),
      mergeMap(({ factureId }) =>
        this.factureClientService.envoyerFacture(factureId).pipe(
          map((message) =>
            FactureClientActions.envoyerEmailFactureSuccess({ message })
          ),
          catchError((error) =>
            of(FactureClientActions.envoyerEmailFactureFailure({ error: error.message }))
          )
        )
      )
    )
  );

  downloadFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.downloadFacture),
      exhaustMap(action =>
        this.factureClientService.downloadFacture(action.factureClientId).pipe(
          map(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `facture_${action.factureClientId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            return { type: '[FactureClient] Download Facture Success' };
          }),
          catchError(error => {
            console.error('Erreur téléchargement facture', error);
            return of({ type: '[FactureClient] Download Facture Failed' });
          })
        )
      )
    )
  );

  getWorkingDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureClientActions.getWorkingDays),
      mergeMap(({ consultant_id, month, year, index }) =>
        this.factureClientService.getWorkingDays(consultant_id, month, year).pipe(
          map((workingDays) => FactureClientActions.getWorkingDaysSuccess({ workingDays, index })),
          catchError((error) => of(FactureClientActions.getWorkingDaysFailure({ error, index })))
        )
      )
    )
  );
}