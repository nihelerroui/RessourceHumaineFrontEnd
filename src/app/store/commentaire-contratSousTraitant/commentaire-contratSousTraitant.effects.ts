import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CommentaireActions from './commentaire-contratSousTraitant.actions';
import { CommentaireContratSousTraitantService } from '../../core/services/commentaireContratSousTraitant.service';

@Injectable()
export class CommentaireContratSousTraitantEffects {
  constructor(
    private actions$: Actions,
    private commentaireService: CommentaireContratSousTraitantService
  ) {}

  // Charger les commentaires
  loadCommentaires$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.loadCommentairesContratSousTraitant),
      mergeMap(({ contratSTId }) =>
        this.commentaireService.getByContratSousTraitantId(contratSTId).pipe(
          map(commentaires =>
            CommentaireActions.loadCommentairesContratSousTraitantSuccess({ commentaires })
          ),
          catchError(error =>
            of(CommentaireActions.loadCommentairesContratSousTraitantFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Ajouter un commentaire
  addCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.addCommentaireContratSousTraitant),
      mergeMap(({ commentaire }) =>
        this.commentaireService.create(commentaire).pipe(
          map(res =>
            CommentaireActions.addCommentaireContratSousTraitantSuccess({ commentaire: res })
          ),
          catchError(error =>
            of(CommentaireActions.addCommentaireContratSousTraitantFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Mettre à jour un commentaire
  updateCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.updateCommentaireContratSousTraitant),
      mergeMap(({ commentaire }) =>
        this.commentaireService.update(commentaire).pipe(
          map(updated =>
            CommentaireActions.updateCommentaireContratSousTraitantSuccess({ commentaire: updated })
          ),
          catchError(error =>
            of(CommentaireActions.updateCommentaireContratSousTraitantFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Supprimer un commentaire
  deleteCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.deleteCommentaireContratSousTraitant),
      mergeMap(({ commentaireId }) =>
        this.commentaireService.delete(commentaireId).pipe(
          map(() =>
            CommentaireActions.deleteCommentaireContratSousTraitantSuccess({ commentaireId })
          ),
          catchError(error =>
            of(CommentaireActions.deleteCommentaireContratSousTraitantFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
