import { createAction, props } from '@ngrx/store';
import { CommentaireContratClient } from '../../models/commentaire-contratClient.model';

// Chargement des commentaires
export const loadCommentairesContratClient = createAction(
  '[Commentaire Contrat Client] Load All',
  props<{ contratClientId: number }>()
);

export const loadCommentairesContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Load All Success',
  props<{ commentaires: CommentaireContratClient[] }>()
);

export const loadCommentairesContratClientFailure = createAction(
  '[Commentaire Contrat Client] Load All Failure',
  props<{ error: string }>()
);

// Ajout d’un commentaire
export const addCommentaireContratClient = createAction(
  '[Commentaire Contrat Client] Add',
  props<{ commentaire: CommentaireContratClient }>()
);

export const addCommentaireContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Add Success',
  props<{ commentaire: CommentaireContratClient }>()
);

export const addCommentaireContratClientFailure = createAction(
  '[Commentaire Contrat Client] Add Failure',
  props<{ error: string }>()
);

// Ajout via token (optionnel – à utiliser si distinction utile)
export const addCommentaireContratClientViaToken = createAction(
  '[Commentaire Contrat Client] Add via Token',
  props<{ commentaire: CommentaireContratClient; token: string }>()
);

export const addCommentaireContratClientViaTokenSuccess = createAction(
  '[Commentaire Contrat Client] Add via Token Success',
  props<{ commentaire: CommentaireContratClient }>()
);

export const addCommentaireContratClientViaTokenFailure = createAction(
  '[Commentaire Contrat Client] Add via Token Failure',
  props<{ error: string }>()
);

// Mise à jour
export const updateCommentaireContratClient = createAction(
  '[Commentaire Contrat Client] Update',
  props<{ commentaire: CommentaireContratClient }>()
);

export const updateCommentaireContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Update Success',
  props<{ commentaire: CommentaireContratClient }>()
);

export const updateCommentaireContratClientFailure = createAction(
  '[Commentaire Contrat Client] Update Failure',
  props<{ error: string }>()
);

// Suppression
export const deleteCommentaireContratClient = createAction(
  '[Commentaire Contrat Client] Delete',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireContratClientSuccess = createAction(
  '[Commentaire Contrat Client] Delete Success',
  props<{ commentaireId: number }>()
);

export const deleteCommentaireContratClientFailure = createAction(
  '[Commentaire Contrat Client] Delete Failure',
  props<{ error: string }>()
);
