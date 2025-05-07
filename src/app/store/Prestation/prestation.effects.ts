import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as PrestationActions from './prestation.action';
import { PrestationService } from '../../core/services/prestation.service';

@Injectable()
export class PrestationEffects {
  constructor(
    private actions$: Actions,
    private prestationService: PrestationService
  ) {}

  loadPrestations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrestationActions.loadPrestations),
      mergeMap(() =>
        this.prestationService.getAll().pipe(
          map(prestations => PrestationActions.loadPrestationsSuccess({ prestations })),
          catchError(error => of(PrestationActions.loadPrestationsFailure({ error })))
        )
      )
    )
  );

  createPrestation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrestationActions.createPrestation),
      mergeMap(action =>
        this.prestationService.createPrestation(action.prestation).pipe(
          map(prestation => PrestationActions.createPrestationSuccess({ prestation })),
          catchError(error => of(PrestationActions.createPrestationFailure({ error })))
        )
      )
    )
  );  

  updatePrestation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrestationActions.updatePrestation),
      mergeMap(action =>
        this.prestationService.updatePrestation(action.prestation).pipe(
          map(prestation => PrestationActions.updatePrestationSuccess({ prestation })),
          catchError(error => of(PrestationActions.updatePrestationFailure({ error })))
        )
      )
    )
  );

  deletePrestation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrestationActions.deletePrestation),
      switchMap(({ id }) =>
        this.prestationService.deletePrestation(id).pipe(
          map(() => PrestationActions.deletePrestationSuccess({ id })),
          catchError(error =>
            of(
              PrestationActions.deletePrestationFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
  
}
