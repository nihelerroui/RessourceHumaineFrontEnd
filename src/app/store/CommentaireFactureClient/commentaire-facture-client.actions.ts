// commentaire-facture-client.actions.ts
import { createAction, props } from '@ngrx/store';
import { CommentaireFactureClient } from '../../shared/models/commentairefactureclient.model';

export const fetchCommentaireFactureClientData = createAction(
  '[CommentaireFactureClient] Fetch Data'
);

export const fetchCommentaireFactureClientDataSuccess = createAction(
  '[CommentaireFactureClient] Fetch Data Success',
  props<{ commentaires: CommentaireFactureClient[] }>()
);

export const fetchCommentaireFactureClientDataFailure = createAction(
  '[CommentaireFactureClient] Fetch Data Failure',
  props<{ error: string }>()
);

export const deleteCommentaireFactureClient = createAction(
  '[CommentaireFactureClient] Delete',
  props<{ id: number }>()
);

export const deleteCommentaireFactureClientSuccess = createAction(
  '[CommentaireFactureClient] Delete Success',
  props<{ id: number }>()
);

export const deleteCommentaireFactureClientFailure = createAction(
  '[CommentaireFactureClient] Delete Failure',
  props<{ error: string }>()
);
