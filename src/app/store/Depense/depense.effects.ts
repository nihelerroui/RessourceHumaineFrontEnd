import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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


}
