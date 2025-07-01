import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SocieteService } from 'src/app/core/services/societe.service';
import * as SocieteActions from './societe.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class SocieteEffects {
  constructor(private actions$: Actions, private societeService: SocieteService) { }

  loadSocietes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SocieteActions.loadSocietes),
      mergeMap(() =>
        this.societeService.getAll().pipe(
          map(societes => SocieteActions.loadSocietesSuccess({ societes })),
          catchError(error => of(SocieteActions.loadSocietesFailure({ error: error.message })))
        )
      )
    )
  );

  addSocieteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SocieteActions.addSocieteSuccess),
      map(() => SocieteActions.loadSocietes())
    )
  );

  updateSociete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SocieteActions.updateSociete),
      mergeMap(action =>
        this.societeService.update(action.societe).pipe(
          map(societe => SocieteActions.updateSocieteSuccess({ societe })),
          catchError(error => of(SocieteActions.updateSocieteFailure({ error: error.message })))
        )
      )
    )
  );


}
