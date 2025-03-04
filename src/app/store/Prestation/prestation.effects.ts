// src/app/store/Prestation/prestation.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as PrestationActions from './prestation.action';
import { PrestationService } from '../../core/services/prestation.service'; // Updated path

@Injectable()
export class PrestationEffects {
  constructor(
    private actions$: Actions,
    private prestationService: PrestationService
  ) {}

  // Since we're only focusing on showing prestations, let's keep only the fetch effect
  fetchPrestations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrestationActions.fetchPrestationData),
      switchMap(() =>
        this.prestationService.getPrestations().pipe(
          map(prestations => PrestationActions.fetchPrestationDataSuccess({ prestations })),
          catchError(error => of(PrestationActions.fetchPrestationDataFailure({ error: error.message })))
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
          catchError(error => of(PrestationActions.deletePrestationFailure({ error: error.message })))
        )
      )
    )
  );
}