import { createAction, props } from '@ngrx/store';
import { CommentaireContrat } from '../../models/commentaire-contrat.model';

/*export const loadCommentairesContrat = createAction(
  '[CommentaireContrat] Load All',
  props<{ contratId: number }>()
);*/

export const loadCommentairesContrat = createAction(
  '[CommentaireContrat] Load All',
  props<{ contratId: number; isSousTraitant?: boolean }>()
);

export const loadCommentairesContratSuccess = createAction(
  '[CommentaireContrat] Load All Success',
  props<{ commentaires: CommentaireContrat[] }>()
);

export const loadCommentairesContratFailure = createAction(
  '[CommentaireContrat] Load All Failure',
  props<{ error: string }>()
);

export const addCommentaireContrat = createAction(
  '[CommentaireContrat] Add',
  props<{ commentaire: CommentaireContrat }>()
);

export const addCommentaireContratSuccess = createAction(
  '[CommentaireContrat] Add Success',
  props<{ commentaire: CommentaireContrat }>()
);

export const addCommentaireContratFailure = createAction(
  '[CommentaireContrat] Add Failure',
  props<{ error: string }>()
);
/** Mise à jour d’un commentaire **/
export const updateCommentaireContrat = createAction(
    '[CommentaireContrat] Update Commentaire',
    props<{ commentaire: CommentaireContrat }>()
  );
  
  export const updateCommentaireContratSuccess = createAction(
    '[CommentaireContrat] Update Commentaire Success',
    props<{ commentaire: CommentaireContrat }>()
  );
  
  export const updateCommentaireContratFailure = createAction(
    '[CommentaireContrat] Update Commentaire Failure',
    props<{ error: string }>()
  );
  
  /** Suppression d’un commentaire **/
  export const deleteCommentaireContrat = createAction(
    '[CommentaireContrat] Delete Commentaire',
    props<{ commentaireId: number }>()
  );
  
  export const deleteCommentaireContratSuccess = createAction(
    '[CommentaireContrat] Delete Commentaire Success',
    props<{ commentaireId: number }>()
  );
  
  export const deleteCommentaireContratFailure = createAction(
    '[CommentaireContrat] Delete Commentaire Failure',
    props<{ error: string }>()
  );
  // Commentaire d'un client via token
export const addCommentaireContratClient = createAction(
    '[Commentaire Contrat] Add Commentaire Client',
    props<{ commentaire: CommentaireContrat; token: string }>()
  );
  
  export const addCommentaireContratClientSuccess = createAction(
    '[Commentaire Contrat] Add Commentaire Client Success',
    props<{ commentaire: CommentaireContrat }>()
  );
  
  export const addCommentaireContratClientFailure = createAction(
    '[Commentaire Contrat] Add Commentaire Client Failure',
    props<{ error: string }>()
  );
  
