import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CaisseService } from 'src/app/core/services/caisse.service';
import * as CaisseActions  from './caisse.actions';
import * as DepenseActions from "src/app/store/Depense/depense.actions";
import * as RecetteActions from "src/app/store/recette/recette.actions";

@Injectable()
export class CaisseEffects {
  constructor(private actions$: Actions, private caisseService: CaisseService) {}

  
  loadCaisse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CaisseActions.loadCaisse),
      mergeMap(({ societeId }) =>
        this.caisseService.getCaisse(societeId).pipe( 
          map((caisse) => CaisseActions.loadCaisseSuccess({ caisse })), 
          catchError((error) => of(CaisseActions.loadCaisseFailure({ error: error.message })))
        )
      )
    )
  );

  setSoldeInitial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CaisseActions.setSoldeInitial),
      mergeMap((action) =>
        this.caisseService.setSoldeInitial(action.societeId, action.montant).pipe(
          map((caisse) => CaisseActions.setSoldeInitialSuccess({ caisse })), 
          catchError((error) => of(CaisseActions.setSoldeInitialFailure({ error: error.message })))
        )
      )
    )
  );

  validerPaiement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CaisseActions.validerPaiement),
      mergeMap(action =>
        this.caisseService.validerPaiement(action.factureAchatId).pipe(
          map(response => {
            if (response.status === 'error') {
              return CaisseActions.validerPaiementFailure({ error: response.message });
            }
            return CaisseActions.validerPaiementSuccess({
              caisse: response.nouveauSolde, 
              factureAchatId: action.factureAchatId       
            });
          }),
          catchError(error =>
            of(CaisseActions.validerPaiementFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  
  

/*augmenterSoldeActuel$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CaisseActions.augmenterSoldeActuel),
    mergeMap(({ societeId, montant, source, motif }) =>
      this.caisseService.augmenterSoldeActuel(societeId, montant, source, motif).pipe(
        mergeMap((response: any) =>
          this.caisseService.getCaisse(societeId).pipe(
            map((caisse) =>
              CaisseActions.augmenterSoldeActuelSuccess({ caisse })
            ),
            catchError((error) =>
              of(CaisseActions.augmenterSoldeActuelFailure({ error: error.message }))
            )
          )
        ),
        catchError((error) =>
          of(CaisseActions.augmenterSoldeActuelFailure({ error: error.message }))
        )
      )
    )
  )
);*/

augmenterSoldeActuel$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CaisseActions.augmenterSoldeActuel),
    mergeMap(({ societeId, montant, source, motif }) =>
  this.caisseService.augmenterSoldeActuel(societeId, montant, source, motif).pipe(
    mergeMap((caisse) => [
      CaisseActions.augmenterSoldeActuelSuccess({ caisse }),
      RecetteActions.loadRecettesBySociete({ societeId }),
      DepenseActions.loadDepenses({ societeId }),
      CaisseActions.loadCaisse({ societeId })
    ]),
    catchError(error => of(CaisseActions.augmenterSoldeActuelFailure({ error })))
  )
)

    
  )
);



loadScoreSante$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CaisseActions.loadScoreSante),
      mergeMap(({ societeId, debut, fin }) =>
        this.caisseService.getScoreSante(societeId, debut, fin).pipe(
          map((score) => CaisseActions.loadScoreSanteSuccess({ score })),
          catchError((error) =>
            of(CaisseActions.loadScoreSanteFailure({ error: error.message || 'Erreur inconnue' }))
          )
        )
      )
    )
  );


}
