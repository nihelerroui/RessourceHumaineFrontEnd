import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DepenseService } from 'src/app/core/services/depense.service';
import * as DepenseActions from './depense.actions';

@Injectable()
export class DepenseEffects {
  constructor(
    private actions$: Actions,
    private depenseService: DepenseService
  ) {}

  // Effect to fetch all depenses
  fetchDepenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepenseActions.fetchDepenseData),
      mergeMap(() =>
        this.depenseService.getDepenses().pipe(
          map((depenses) => DepenseActions.fetchDepenseSuccess({ depenses })),
          catchError((error) =>
            of(DepenseActions.fetchDepenseFailure({ error: error.message }))
        )
      )
    )
  ));

  // Effect to create a new depense
  createDepense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepenseActions.createDepense),
      mergeMap((action) =>
        this.depenseService.createDepense(action.depense).pipe(
          map((depense) => DepenseActions.createDepenseSuccess({ depense })),
          catchError((error) =>
            of(DepenseActions.createDepenseFailure({ error: error.message }))
        )
      )
    )
  ));

  // Effect to update an existing depense
  updateDepense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepenseActions.updateDepense),
      mergeMap((action) =>
        this.depenseService.updateDepense(action.depense).pipe(
          map((depense) => DepenseActions.updateDepenseSuccess({ depense })),
          catchError((error) =>
            of(DepenseActions.updateDepenseFailure({ error: error.message }))
        )
      )
    )
  ));

  // Effect to delete a depense
  deleteDepense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepenseActions.deleteDepense),
      mergeMap((action) =>
        this.depenseService.deleteDepense(action.id).pipe(
          map(() => DepenseActions.deleteDepenseSuccess({ id: action.id })),
          catchError((error) =>
            of(DepenseActions.deleteDepenseFailure({ error: error.message }))
          )
        )
      )
    )
  );
}