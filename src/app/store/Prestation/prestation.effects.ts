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

  // Fetch Prestations (now using the generic service)
  fetchPrestations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrestationActions.fetchPrestationData),
      switchMap(() =>
        this.prestationService.getAll().pipe( // Using `getAll` from GenericService
          map(prestations => PrestationActions.fetchPrestationDataSuccess({ prestations })),
          catchError(error => of(PrestationActions.fetchPrestationDataFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete Prestation (no changes required for delete action as it's already handled in PrestationService)
  deletePrestation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrestationActions.deletePrestation),
      switchMap(({ id }) =>
        this.prestationService.delete(id.toString()).pipe( // Convert id to string
          map(() => PrestationActions.deletePrestationSuccess({ id })),
          catchError(error => of(PrestationActions.deletePrestationFailure({ error: error.message })))
        )
      )
    )
  );
  
}
