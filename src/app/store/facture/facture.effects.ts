import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { FactureService } from 'src/app/core/services/facture.service';
import {
  loadFactures,
  loadFacturesSuccess,
  loadFacturesFailure,
  addFacture,
  addFactureSuccess,
  addFactureFailure,
  updateFacture,
  updateFactureSuccess,
  updateFactureFailure,
  deleteFacture,
  deleteFactureSuccess,
  deleteFactureFailure
} from './facture.actions';
import { Facture } from '../../models/facture.model';

@Injectable()
export class FactureEffects {
  
  // 🔹 Effet pour charger la liste des factures
  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFactures),
      mergeMap(() =>
        this.factureService.getAll().pipe(
          map((factures: Facture[]) => loadFacturesSuccess({ factures })),
          catchError((error) => of(loadFacturesFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour ajouter une facture
  addFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFacture),
      mergeMap((action) =>
        this.factureService.create(action.facture).pipe(
          map((newFacture: Facture) => addFactureSuccess({ facture: newFacture })),
          catchError((error) => of(addFactureFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour mettre à jour une facture
  updateFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFacture),
      mergeMap((action) =>
        this.factureService.update(action.facture).pipe(
          map((updatedFacture: Facture) => updateFactureSuccess({ facture: updatedFacture })),
          catchError((error) => of(updateFactureFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Effet pour supprimer une facture
  deleteFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteFacture),
      mergeMap((action) =>
        this.factureService.delete(String(action.factureId)).pipe(
          map(() => deleteFactureSuccess({ factureId: action.factureId })),
          catchError((error) => of(deleteFactureFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private factureService: FactureService
  ) {}
}
