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
}
