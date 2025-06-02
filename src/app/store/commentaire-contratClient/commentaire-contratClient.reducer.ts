import { createReducer, on } from '@ngrx/store';
import * as CommentaireClientActions from './commentaire-contratClient.actions';
import { CommentaireContratClient } from '../../models/commentaire-contratClient.model';

export interface CommentaireContratClientState {
  commentaires: CommentaireContratClient[];
  loading: boolean;
  error: string | null;
}

export const initialState: CommentaireContratClientState = {
  commentaires: [],
  loading: false,
  error: null,
};

export const commentaireContratClientReducer = createReducer(
  initialState,

  // LOAD
  on(CommentaireClientActions.loadCommentairesContratClient, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CommentaireClientActions.loadCommentairesContratClientSuccess, (state, { commentaires }) => ({
    ...state,
    commentaires,
    loading: false,
    error: null,
  })),
  on(CommentaireClientActions.loadCommentairesContratClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ADD
  on(CommentaireClientActions.addCommentaireContratClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
    loading: false,
  })),

  // UPDATE
  on(CommentaireClientActions.updateCommentaireContratClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: state.commentaires.map((c) =>
      c.commentaireId === commentaire.commentaireId ? commentaire : c
    ),
  })),

  // DELETE
  on(CommentaireClientActions.deleteCommentaireContratClientSuccess, (state, { commentaireId }) => ({
    ...state,
    commentaires: state.commentaires.filter((c) => c.commentaireId !== commentaireId),
  }))
);
