import { createAction, props } from '@ngrx/store';
import { CommentaireFactureClient } from '../../models/CommentaireFactureClient.models';

// Load all comments for a specific facture
export const loadCommentairesFactureClient = createAction(
  '[Commentaire Facture Client] Load Comments',
  props<{ factureId: number }>()
);

export const loadCommentairesFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Load Comments Success',
  props<{ commentaires: CommentaireFactureClient[] }>()
);

export const loadCommentairesFactureClientFailure = createAction(
  '[Commentaire Facture Client] Load Comments Failure',
  props<{ error: any }>()
);

// Add comment
export const addCommentaireFactureClient = createAction(
  '[Commentaire Facture Client] Add Comment',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const addCommentaireFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Add Comment Success',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const addCommentaireFactureClientFailure = createAction(
  '[Commentaire Facture Client] Add Comment Failure',
  props<{ error: any }>()
);

// Update comment
export const updateCommentaireFactureClient = createAction(
  '[Commentaire Facture Client] Update Comment',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const updateCommentaireFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Update Comment Success',
  props<{ commentaire: CommentaireFactureClient }>()
);

export const updateCommentaireFactureClientFailure = createAction(
  '[Commentaire Facture Client] Update Comment Failure',
  props<{ error: any }>()
);

// Delete comment
export const deleteCommentaireFactureClient = createAction(
  '[Commentaire Facture Client] Delete Comment',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireFactureClientSuccess = createAction(
  '[Commentaire Facture Client] Delete Comment Success',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireFactureClientFailure = createAction(
  '[Commentaire Facture Client] Delete Comment Failure',
  props<{ error: any }>()
);
