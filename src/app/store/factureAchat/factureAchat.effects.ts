import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FactureAchatService } from 'src/app/core/services/factureAchat.service';
import * as FacturesAchatsActions  from './factureAchat.actions';
import { FactureAchat } from '../../models/factureAchat.model';

@Injectable()
export class FactureAchatEffects {
  
  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FacturesAchatsActions.loadFacturesAchat),
      mergeMap(() =>
        this.factureService.getAll().pipe(
          map((factures: FactureAchat[]) => FacturesAchatsActions.loadFacturesAchatSuccess({ factures })),
          catchError((error) => of(FacturesAchatsActions.loadFacturesAchatFailure({ error: error.message })))
        )
      )
    )
  );


  addFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FacturesAchatsActions.addFactureAchat),
      mergeMap((action) =>
        this.factureService.createFacture(action.facture).pipe( 
          map((newFacture: FactureAchat) => FacturesAchatsActions.addFactureAchatSuccess({ facture: newFacture })),
          catchError((error) => of(FacturesAchatsActions.addFactureAchatFailure({ error: error.message })))
        )
      )
      
    )
  );


  updateFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FacturesAchatsActions.updateFactureAchat),
      mergeMap(action =>
        this.factureService.updateFacture(action.facture).pipe(
          map(facture => FacturesAchatsActions.updateFactureAchatSuccess({ facture })),
          catchError(error => of(FacturesAchatsActions.updateFactureAchatFailure({ error: error.message })))
        )
      )
    )
  );


  deleteFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FacturesAchatsActions.deleteFactureAchat),
      mergeMap((action) =>
        this.factureService.delete(action.factureAchatId).pipe(
          map(() => FacturesAchatsActions.deleteFactureAchatSuccess({ factureAchatId: action.factureAchatId })),
          catchError((error) => of(FacturesAchatsActions.deleteFactureAchatFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private factureService: FactureAchatService
  ) {}
}
