import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { PaysService } from 'src/app/core/services/pays.service';
import {
  loadPays,
  loadPaysSuccess,
  loadPaysFailure,
  addPays,
  addPaysSuccess,
  addPaysFailure,
  updatePays,
  updatePaysSuccess,
  updatePaysFailure,
  deletePays,
  deletePaysSuccess,
  deletePaysFailure
} from './pays.actions';
import { Pays } from './pays.models';

@Injectable()
export class PaysEffects {
  
  // 🔹 Effet pour charger la liste des pays
  loadPays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPays),
      mergeMap(() =>
        this.paysService.getPays().pipe(
          map((paysList: Pays[]) => loadPaysSuccess({ paysList })),
          catchError((error) => of(loadPaysFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour ajouter un pays
  addPays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPays),
      mergeMap((action) =>
        this.paysService.addPays(action.pays).pipe(
          map((newPays: Pays) => addPaysSuccess({ pays: newPays })),
          catchError((error) => of(addPaysFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour mettre à jour un pays
  updatePays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePays),
      mergeMap((action) =>
        this.paysService.updatePays(action.pays).pipe(
          map((updatedPays: Pays) => updatePaysSuccess({ pays: updatedPays })),
          catchError((error) => of(updatePaysFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour supprimer un pays
  deletePays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePays),
      mergeMap((action) =>
        this.paysService.deletePays(action.paysId).pipe(
          map(() => deletePaysSuccess({ paysId: action.paysId })),
          catchError((error) => of(deletePaysFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private paysService: PaysService
  ) {}
}
