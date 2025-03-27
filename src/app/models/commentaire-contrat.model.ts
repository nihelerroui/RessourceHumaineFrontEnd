export interface CommentaireContrat {
    commentaireId?: number;
    contenu: string;
    auteurCommentaire?: string;
    dateCommentaire?: string;
    contratClient?: {
      contratClientId: number;
    };
    contratSousTraitant?: {
      contratId: number;
    };
  }
  