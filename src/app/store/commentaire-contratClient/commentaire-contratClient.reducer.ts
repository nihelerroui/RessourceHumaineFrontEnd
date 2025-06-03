import { createReducer, on } from '@ngrx/store';
import { CommentaireContratClient } from '../../models/commentaire-contratClient.model';
import * as CommentaireActions from './commentaire-contratClient.actions';

export interface CommentaireContratClientState {
  commentaires: CommentaireContratClient[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentaireContratClientState = {
  commentaires: [],
  loading: false,
  error: null,
};

export const commentaireContratClientReducer = createReducer(
  initialState,
  on(CommentaireActions.loadCommentairesContratClient, state => ({ ...state, loading: true })),
  on(CommentaireActions.loadCommentairesContratClientSuccess, (state, { commentaires }) => ({
    ...state,
    commentaires,
    loading: false,
  })),
  on(CommentaireActions.loadCommentairesContratClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CommentaireActions.addCommentaireContratClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
  })),
  on(CommentaireActions.updateCommentaireContratClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: state.commentaires.map(c =>
      c.commentaireId === commentaire.commentaireId ? commentaire : c
    ),
  })),
  on(CommentaireActions.deleteCommentaireContratClientSuccess, (state, { commentaireId }) => ({
    ...state,
    commentaires: state.commentaires.filter(c => c.commentaireId !== commentaireId),
  }))
);
