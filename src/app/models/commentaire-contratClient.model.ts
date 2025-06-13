import { ContratClient } from "./contratClient.models";

export interface CommentaireContratClient {
  commentaireId?: number;
  contenu: string;
  auteurCommentaire?: string;
  dateCommentaire?: string;
  contratClient?: ContratClient;
}
