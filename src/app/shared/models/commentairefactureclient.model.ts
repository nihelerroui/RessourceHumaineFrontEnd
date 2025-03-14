// commentaire-facture-client.interface.ts
export interface CommentaireFactureClient {
    commentaireId: number;
    contenu: string;
    dateCommentaire: string; // Can be LocalDate, but string for date formatting in frontend
    auteurCommentaire: string;
    factureClient: FactureClient;
  }
  
  export interface FactureClient {
    factureId: number;
    reference: string; // Add other fields as needed
  }
  