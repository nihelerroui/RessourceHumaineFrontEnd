import { FactureClient } from "./factureClient.models";

export interface CommentaireFactureClient {
    commentaireId?: number;
    contenu: string;
    dateCommentaire?: string;
    auteurCommentaire: string;
    factureClient?: FactureClient
  }
  