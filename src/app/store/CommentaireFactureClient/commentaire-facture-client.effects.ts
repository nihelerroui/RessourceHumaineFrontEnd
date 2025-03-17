import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommentaireFactureClientService } from '../../core/services/commentaire-facture-client.service';
import * as CommentaireFactureClientActions from './commentaire-facture-client.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class CommentaireFactureClientEffects {
  constructor(
    private actions$: Actions,
    private commentaireFactureClientService: CommentaireFactureClientService
  ) {}

  loadCommentaires$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireFactureClientActions.fetchCommentaireFactureClientData),
      mergeMap(() =>
        this.commentaireFactureClientService.getAllCommentaires().pipe(
          map(commentaires =>
            CommentaireFactureClientActions.fetchCommentaireFactureClientDataSuccess({ commentaires })
          ),
          catchError(error =>
            of(CommentaireFactureClientActions.fetchCommentaireFactureClientDataFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireFactureClientActions.createCommentaireFactureClient),
      mergeMap(action =>
        this.commentaireFactureClientService.createCommentaire(action.commentaireDTO).pipe(
          map(commentaire =>
            CommentaireFactureClientActions.createCommentaireFactureClientSuccess({ commentaire })
          ),
          catchError(error =>
            of(CommentaireFactureClientActions.createCommentaireFactureClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireFactureClientActions.deleteCommentaireFactureClient),
      mergeMap(action =>
        this.commentaireFactureClientService.deleteCommentaire(action.id).pipe(
          map(() =>
            CommentaireFactureClientActions.deleteCommentaireFactureClientSuccess({ id: action.id })
          ),
          catchError(error =>
            of(CommentaireFactureClientActions.deleteCommentaireFactureClientFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
