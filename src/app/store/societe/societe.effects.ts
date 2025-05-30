import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SocieteService } from 'src/app/core/services/societe.service';
import * as SocieteActions from './societe.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class SocieteEffects {
  constructor(private actions$: Actions, private societeService: SocieteService) {}

  // Charger les sociétés
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

  // Ajouter une société
  addSociete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SocieteActions.addSociete),
      mergeMap(action =>
        this.societeService.create(action.societe).pipe(
          map(societe => SocieteActions.addSocieteSuccess({ societe })),
          catchError(error => of(SocieteActions.addSocieteFailure({ error: error.message })))
        )
      )
    )
  );

  // Mettre à jour une société
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

  // Supprimer une société
  deleteSociete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SocieteActions.deleteSociete),
      mergeMap(action =>
        this.societeService.delete(action.societeId).pipe(
          map(() => SocieteActions.deleteSocieteSuccess({ societeId: action.societeId })),
          catchError(error => of(SocieteActions.deleteSocieteFailure({ error: error.message })))
        )
      )
    )
  );
  // Sociétés administrées par l'admin connecté
  loadAdministrees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SocieteActions.loadSocietesAdministrees),
      mergeMap(() =>
        this.societeService.getSocietesAdministrees().pipe(
          map(societes =>
            SocieteActions.loadSocietesAdministreesSuccess({ societes })
          ),
          catchError(error =>
            of(SocieteActions.loadSocietesAdministreesFailure({ error }))
          )
        )
      )
    )
  );
}
