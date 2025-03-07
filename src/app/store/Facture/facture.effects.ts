import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as FactureActions from './facture.actions';
import { FactureService } from '../../core/services/facture.service';

@Injectable()
export class FactureEffects {
  constructor(
    private actions$: Actions,
    private factureService: FactureService
  ) {}

  // Fetch Facture by ID
  fetchFactureById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FactureActions.fetchFactureById),
      switchMap(({ id }) =>
        this.factureService.getFactureById(id).pipe(
          map(facture => FactureActions.fetchFactureByIdSuccess({ facture })),
          catchError(error => of(FactureActions.fetchFactureByIdFailure({ error: error.message })))
      )
    )
  ));
}