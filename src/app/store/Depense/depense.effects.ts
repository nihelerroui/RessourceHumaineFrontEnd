import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as DepenseActions from './depense.actions';
import { DepenseService } from '../../core/services/depense.service';

@Injectable()
export class DepenseEffects {
  constructor(
    private actions$: Actions,
    private depenseService: DepenseService
  ) {}

  fetchDepenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepenseActions.fetchDepenseData),
      switchMap(() =>
        this.depenseService.getDepenses().pipe(
          map(depenses => DepenseActions.fetchDepenseDataSuccess({ depenses })),
          catchError(error => of(DepenseActions.fetchDepenseDataFailure({ error: error.message })))
        )
      )
    )
  );

  deleteDepense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepenseActions.deleteDepense),
      switchMap(({ id }) =>
        this.depenseService.deleteDepense(id).pipe(
          map(() => DepenseActions.deleteDepenseSuccess({ id })),
          catchError(error => of(DepenseActions.deleteDepenseFailure({ error: error.message })))
        )
      )
    )
  );
}
