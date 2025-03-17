import { createReducer, on } from '@ngrx/store';
import * as CommentaireFactureClientActions from './commentaire-facture-client.actions';
import { CommentaireFactureClient } from '../../shared/models/commentairefactureclient.model';

export interface CommentaireFactureClientState {
  commentaires: CommentaireFactureClient[];
  loading: boolean;
  error: string | null;
}

export const initialState: CommentaireFactureClientState = {
  commentaires: [],
  loading: false,
  error: null
};

export const commentaireFactureClientReducer = createReducer(
  initialState,
  on(CommentaireFactureClientActions.fetchCommentaireFactureClientData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CommentaireFactureClientActions.fetchCommentaireFactureClientDataSuccess, (state, { commentaires }) => ({
    ...state,
    commentaires,
    loading: false
  })),
  on(CommentaireFactureClientActions.fetchCommentaireFactureClientDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CommentaireFactureClientActions.createCommentaireFactureClientSuccess, (state, { commentaire }) => ({
    ...state,
    commentaires: [...state.commentaires, commentaire],
    loading: false
  })),
  on(CommentaireFactureClientActions.createCommentaireFactureClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CommentaireFactureClientActions.deleteCommentaireFactureClientSuccess, (state, { id }) => ({
    ...state,
    commentaires: state.commentaires.filter(commentaire => commentaire.commentaireId !== id),
    loading: false
  })),
  on(CommentaireFactureClientActions.deleteCommentaireFactureClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
