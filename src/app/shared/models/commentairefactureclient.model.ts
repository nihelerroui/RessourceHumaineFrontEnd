// commentaire-facture-client.interface.ts
export interface CommentaireFactureClient {
    contenu: string;
    dateCommentaire: string; // Can be LocalDate, but string for date formatting in frontend
    auteurCommentaire: string;
    factureClientId: number;
  }
  
