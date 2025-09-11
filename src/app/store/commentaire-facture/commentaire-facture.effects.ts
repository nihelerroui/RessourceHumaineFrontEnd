import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommentaireFactureClientService } from 'src/app/core/services/commentaire-facture-client.service';
import * as CommentaireActions from './commentaire-facture.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { CommentaireFactureClient } from '../../models/CommentaireFactureClient.models';

@Injectable()
export class CommentaireFactureClientEffects {
  constructor(
    private actions$: Actions,
    private commentaireService: CommentaireFactureClientService
  ) {}

  loadCommentaires$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.loadCommentairesFactureClient),
      mergeMap(({ factureId }) =>
        this.commentaireService.getByFactureId(factureId).pipe(
          map((commentaires: CommentaireFactureClient[]) =>
            CommentaireActions.loadCommentairesFactureClientSuccess({ commentaires })
          ),
          catchError((error) =>
            of(CommentaireActions.loadCommentairesFactureClientFailure({ error }))
          )
        )
      )
    )
  );

  addCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.addCommentaireFactureClient),
      mergeMap(({ commentaire }) =>
        this.commentaireService.create(commentaire).pipe(
          map((created: CommentaireFactureClient) =>
            CommentaireActions.addCommentaireFactureClientSuccess({ commentaire: created })
          )
        )
      )
    )
  );

  updateCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.updateCommentaireFactureClient),
      mergeMap(({ commentaire }) =>
        this.commentaireService.update(commentaire).pipe(
          map((updated: CommentaireFactureClient) =>
            CommentaireActions.updateCommentaireFactureClientSuccess({ commentaire: updated })
          )
        )
      )
    )
  );

  deleteCommentaire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.deleteCommentaireFactureClient),
      mergeMap(({ commentaireId }) =>
        this.commentaireService.delete(commentaireId).pipe(
          map(() =>
            CommentaireActions.deleteCommentaireFactureClientSuccess({ commentaireId })
          )
        )
      )
    )
  );
  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.addCommentClient),
      mergeMap(({ commentaire, token }) =>
        this.commentaireService.addCommentClient(commentaire, token).pipe(
          map(res => CommentaireActions.addCommentClientSuccess({ commentaire: res })),
          catchError(error => of(CommentaireActions.addCommentClientFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.updateCommentClient),
      mergeMap(({ commentaire, token }) =>
        this.commentaireService.updateCommentClient(commentaire, token).pipe(
          map(res => CommentaireActions.updateCommentClientSuccess({ commentaire: res })),
          catchError(error => of(CommentaireActions.updateCommentClientFailure({ error })))
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentaireActions.deleteCommentClient),
      mergeMap(({ commentaireId, token }) =>
        this.commentaireService.deleteCommentClient(commentaireId, token).pipe(
          map(() => CommentaireActions.deleteCommentClientSuccess({ commentaireId })),
          catchError(error => of(CommentaireActions.deleteCommentClientFailure({ error })))
        )
      )
    )
  );
  loadCommentairesClient$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CommentaireActions.loadCommentairesClient),
    mergeMap(({ factureId, token }) =>
      this.commentaireService.getCommentairesByFactureClient(factureId, token).pipe(
        map((commentaires) =>
          CommentaireActions.loadCommentairesClientSuccess({ commentaires })
        ),
        catchError((error) =>
          of(CommentaireActions.loadCommentairesClientFailure({ error }))
        )
      )
    )
  )
);

}
