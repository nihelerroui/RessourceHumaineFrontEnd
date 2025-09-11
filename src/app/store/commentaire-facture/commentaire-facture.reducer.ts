import { createReducer, on } from '@ngrx/store';
import * as CommentaireActions from './commentaire-facture.actions';
import { CommentaireFactureClient } from '../../models/CommentaireFactureClient.models';

export interface CommentaireFactureClientState {
  commentaires: CommentaireFactureClient[];
  loading: boolean;
  error: any;
}

export const initialState: CommentaireFactureClientState = {
  commentaires: [],
  loading: false,
  error: null,
};

export const commentaireFactureClientReducer = createReducer(
  initialState,

  // Load
  on(CommentaireActions.loadCommentairesFactureClient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CommentaireActions.loadCommentairesFactureClientSuccess, (state, { commentaires }) => ({
    ...state,
    loading: false,
    commentaires,
  })),
  on(CommentaireActions.loadCommentairesFactureClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add
  on(CommentaireActions.addCommentaireFactureClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
  })),

  // Update
  on(CommentaireActions.updateCommentaireFactureClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: state.commentaires.map((c) =>
      c.commentaireId === commentaire.commentaireId ? commentaire : c
    ),
  })),

  // Delete
  on(CommentaireActions.deleteCommentaireFactureClientSuccess, (state, { commentaireId }) => ({
    ...state,
    commentaires: state.commentaires.filter((c) => c.commentaireId !== commentaireId),
  })),
  // Add
  on(CommentaireActions.addCommentClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
    error: null
  })),
  on(CommentaireActions.addCommentClientFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Update
  on(CommentaireActions.updateCommentClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: state.commentaires.map(c => c.commentaireId === commentaire.commentaireId ? commentaire : c),
    error: null
  })),
  on(CommentaireActions.updateCommentClientFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Delete
  on(CommentaireActions.deleteCommentClientSuccess, (state, { commentaireId }) => ({
    ...state,
    commentaires: state.commentaires.filter(c => c.commentaireId !== commentaireId),
    error: null
  })),
  on(CommentaireActions.deleteCommentClientFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(CommentaireActions.loadCommentairesClientSuccess, (state, { commentaires }) => ({
  ...state,
  commentaires,
  loading: false,
  error: null
})),
on(CommentaireActions.loadCommentairesClientFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
}))

);
