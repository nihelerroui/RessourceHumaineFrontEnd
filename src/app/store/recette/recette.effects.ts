import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RecetteService } from 'src/app/core/services/recette.service';
import * as RecetteActions from './recette.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class RecetteEffects {
  constructor(
    private actions$: Actions,
    private recetteService: RecetteService
  ) {}

  loadRecettes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecetteActions.loadRecettes),
      mergeMap(() =>
        this.recetteService.getAll().pipe(
          map((recettes) => RecetteActions.loadRecettesSuccess({ recettes })),
          catchError((error) => of(RecetteActions.loadRecettesFailure({ error })))
        )
      )
    )
  );

  loadRecettesBySociete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecetteActions.loadRecettesBySociete),
      mergeMap(({ societeId }) =>
        this.recetteService.getRecettesBySociete(societeId).pipe(
          map(recettes => RecetteActions.loadRecettesSuccess({ recettes })),
          catchError(error => of(RecetteActions.loadRecettesFailure({ error })))
        )
      )
    )
  );
}
