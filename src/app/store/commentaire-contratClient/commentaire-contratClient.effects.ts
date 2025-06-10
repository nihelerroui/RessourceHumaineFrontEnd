import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CommentaireActions from './commentaire-contratClient.actions';
import { CommentaireContratClientService } from '../../core/services/commentaireContratClientService';

@Injectable()
export class CommentaireContratClientEffects {
  constructor(
    private actions$: Actions,
    private commentaireService: CommentaireContratClientService
  ) {}

  loadCommentaires$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.loadCommentairesContratClient),
      mergeMap(({ contratClientId }) =>
        this.commentaireService.getByContratClientId(contratClientId).pipe(
          map(commentaires =>
            CommentaireActions.loadCommentairesContratClientSuccess({ commentaires })
          ),
          catchError(error =>
            of(CommentaireActions.loadCommentairesContratClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.addCommentaireContratClient),
      mergeMap(({ commentaire }) =>
        this.commentaireService.create(commentaire).pipe(
          map(res =>
            CommentaireActions.addCommentaireContratClientSuccess({ commentaire: res })
          ),
          catchError(error =>
            of(CommentaireActions.addCommentaireContratClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.updateCommentaireContratClient),
      mergeMap(({ commentaire }) =>
        this.commentaireService.update(commentaire).pipe(
          map(updated =>
            CommentaireActions.updateCommentaireContratClientSuccess({ commentaire: updated })
          ),
          catchError(error =>
            of(CommentaireActions.updateCommentaireContratClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.deleteCommentaireContratClient),
      mergeMap(({ commentaireId }) =>
        this.commentaireService.delete(commentaireId).pipe(
          map(() =>
            CommentaireActions.deleteCommentaireContratClientSuccess({ commentaireId })
          ),
          catchError(error =>
            of(CommentaireActions.deleteCommentaireContratClientFailure({ error: error.message }))
          )
        )
      )
    )
  );
  // === CLIENT: Load Commentaires ===
loadCommentairesClient$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CommentaireActions.loadCommentairesClientContrat),
    mergeMap(({ contratClientId, token }) =>
      this.commentaireService.getCommentairesByContratClient(contratClientId, token).pipe(
        map(commentaires =>
          CommentaireActions.loadCommentairesClientContratSuccess({ commentaires })
        ),
        catchError(error =>
          of(CommentaireActions.loadCommentairesClientContratFailure({ error: error.message }))
        )
      )
    )
  )
);

// === CLIENT: Add Commentaire ===
addCommentClient$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CommentaireActions.addCommentClientContrat),
    mergeMap(({ commentaire, token }) =>
      this.commentaireService.addCommentContratClient(commentaire, token).pipe(
        map(res =>
          CommentaireActions.addCommentClientContratSuccess({ commentaire: res })
        ),
        catchError(error =>
          of(CommentaireActions.addCommentClientContratFailure({ error: error.message }))
        )
      )
    )
  )
);

// === CLIENT: Update Commentaire ===
updateCommentClient$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CommentaireActions.updateCommentClientContrat),
    mergeMap(({ commentaire, token }) =>
      this.commentaireService.updateCommentContratClient(commentaire, token).pipe(
        map(updated =>
          CommentaireActions.updateCommentClientContratSuccess({ commentaire: updated })
        ),
        catchError(error =>
          of(CommentaireActions.updateCommentClientContratFailure({ error: error.message }))
        )
      )
    )
  )
);

// === CLIENT: Delete Commentaire ===
deleteCommentClient$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CommentaireActions.deleteCommentClientContrat),
    mergeMap(({ commentaireId, token }) =>
      this.commentaireService.deleteCommentContratClient(commentaireId, token).pipe(
        map(() =>
          CommentaireActions.deleteCommentClientContratSuccess({ commentaireId })
        ),
        catchError(error =>
          of(CommentaireActions.deleteCommentClientContratFailure({ error: error.message }))
        )
      )
    )
  )
);

}
