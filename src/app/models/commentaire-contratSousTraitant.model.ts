import { ContratSousTraitant } from "./contrat.models";

export interface CommentaireContratSousTraitant {
  commentaireId?: number;
  contenu: string;
  auteurCommentaire?: string;
  dateCommentaire?: string;
  contratSousTraitant?: ContratSousTraitant;
}
