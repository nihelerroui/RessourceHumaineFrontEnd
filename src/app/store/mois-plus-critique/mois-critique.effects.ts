import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MoisCritiqueResponse, MoisCritiqueService } from '../../core/services/mois_critique.service';
import * as MoisCritiqueActions from './mois-critique.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class MoisCritiqueEffects {
  loadCriticalMonth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoisCritiqueActions.loadCriticalMonth),
      mergeMap(() =>
        this.moisCritiqueService.getCriticalMonth().pipe(
          map((data: MoisCritiqueResponse) => MoisCritiqueActions.loadCriticalMonthSuccess({ data })),
          catchError((error) => of(MoisCritiqueActions.loadCriticalMonthFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private moisCritiqueService: MoisCritiqueService
  ) {}
}
