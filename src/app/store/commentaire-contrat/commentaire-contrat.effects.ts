import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CommentaireActions from '../commentaire-contrat/commentaire-contrat.actions';
import { CommentaireContratService } from '../../core/services/commentaireContratService';

@Injectable()
export class CommentaireContratEffects {
  constructor(
    private actions$: Actions,
    private commentaireService: CommentaireContratService
  ) {}

  loadCommentaires$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.loadCommentairesContrat),
      mergeMap(({ contratId, isSousTraitant }) =>
        this.commentaireService.getCommentairesByContrat(contratId, isSousTraitant).pipe(
          map(commentaires => CommentaireActions.loadCommentairesContratSuccess({ commentaires })),
          catchError(error =>
            of(CommentaireActions.loadCommentairesContratFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  

  addCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.addCommentaireContrat),
      mergeMap(({ commentaire }) =>
        this.commentaireService.create(commentaire).pipe(
          map((res) => CommentaireActions.addCommentaireContratSuccess({ commentaire: res })),
          catchError((error) =>
            of(CommentaireActions.addCommentaireContratFailure({ error: error.message }))
          )
        )
      )
    )
  );
   // Update a commentaire
   updateCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.updateCommentaireContrat),
      mergeMap(({ commentaire }) =>
        this.commentaireService.update(commentaire).pipe(
          map(updated => CommentaireActions.updateCommentaireContratSuccess({ commentaire: updated })),
          catchError(error => of(CommentaireActions.updateCommentaireContratFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete a commentaire
  deleteCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.deleteCommentaireContrat),
      mergeMap(({ commentaireId }) =>
        this.commentaireService.delete(commentaireId.toString()).pipe(
          map(() => CommentaireActions.deleteCommentaireContratSuccess({ commentaireId })),
          catchError(error => of(CommentaireActions.deleteCommentaireContratFailure({ error: error.message })))
        )
      )
    )
  );
   // ADD (CLIENT TOKEN)
   addCommentaireClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.addCommentaireContratClient),
      mergeMap(({ commentaire, token }) =>
        this.commentaireService.create(commentaire).pipe(
          map((res) =>
            CommentaireActions.addCommentaireContratClientSuccess({ commentaire: res })
          ),
          catchError((error) =>
            of(CommentaireActions.addCommentaireContratClientFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
}