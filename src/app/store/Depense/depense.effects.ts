import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as DepenseActions from './depense.actions';
import { DepenseService } from 'src/app/core/services/depense.service';

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
        this.depenseService.getAll().pipe(
          map(depenses => {
            const depensesArray = Array.isArray(depenses) ? depenses : [depenses];
            return DepenseActions.fetchDepenseDataSuccess({ depenses: depensesArray });
          }),
          catchError(error => of(DepenseActions.fetchDepenseDataFailure({ error: error.message })))
        )
        
      )
    )
  );

  loadDepenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepenseActions.loadDepenses),
      mergeMap(({ societeId }) =>
        this.depenseService.getDepensesBySociete(societeId).pipe(
          map(depenses => DepenseActions.loadDepensesSuccess({ depenses })),
          catchError(error => of(DepenseActions.loadDepensesFailure({ error })))
        )
      )
    )
  );


}
