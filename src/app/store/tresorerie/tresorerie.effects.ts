import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TresorerieService } from 'src/app/core/services/tresorerie.service';
import * as TresorerieActions from './tresorerie.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class TresorerieEffects {
  constructor(
    private actions$: Actions,
    private tresorerieService: TresorerieService
  ) {}

  loadTresorerie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TresorerieActions.loadTresorerie),
      mergeMap((action) =>
        this.tresorerieService.getTresorerieBySociete(action.societeId).pipe(
          map((tresorerie) =>
            TresorerieActions.loadTresorerieSuccess({ tresorerie })
          ),
          catchError((error) =>
            of(TresorerieActions.loadTresorerieFailure({ error }))
          )
        )
      )
    )
  );

  createTresorerie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TresorerieActions.createTresorerie),
      mergeMap((action) =>
        this.tresorerieService.createTresorerie(action.tresorerie).pipe(
          map((tresorerie) =>
            TresorerieActions.createTresorerieSuccess({ tresorerie })
          ),
          catchError((error) =>
            of(TresorerieActions.createTresorerieFailure({ error }))
          )
        )
      )
    )
  );
}
