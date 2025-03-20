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
  
  // 🔹 Charger les factures
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

  // 🔹 Ajouter une facture avec fichier
  addFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFacture),
      mergeMap((action) =>
        this.factureService.createFacture(action.facture).pipe( // ✅ `facture` est bien un `FormData`
          map((newFacture: Facture) => addFactureSuccess({ facture: newFacture })),
          catchError((error) => of(addFactureFailure({ error: error.message })))
        )
      )
      
    )
  );

  // 🔹 Mettre à jour une facture avec fichier
  updateFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFacture),
      mergeMap((action) =>
        this.factureService.updateFacture(action.facture).pipe( // ✅ Supprime `action.file`
          map((updatedFacture: Facture) => updateFactureSuccess({ facture: updatedFacture })),
          catchError((error) => of(updateFactureFailure({ error: error.message })))
        )
      )
    )
  );

  // 🔹 Supprimer une facture
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
