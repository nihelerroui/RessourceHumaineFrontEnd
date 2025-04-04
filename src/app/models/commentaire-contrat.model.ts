import { ContratClient } from "./contratClient.models";
import { ContratSousTraitant } from "./contrat.models";

export interface CommentaireContrat {
  commentaireId?: number;
  contenu: string;
  auteurCommentaire?: string;
  dateCommentaire?: string;
  contratClient?: ContratClient;
  contratSousTraitant?: ContratSousTraitant;
}
