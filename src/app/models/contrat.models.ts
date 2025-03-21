export interface ContratSousTraitant {
  contratId?: number;
  dateDebut: string; // format yyyy-MM-dd
  dateFin: string;
  tjm: number;
  conditionsFac: string;
  statutContrat: string;
  filePath?: string; // Chemin du fichier
}

  export enum StatutContrat {
    EN_ATTENTE = "EN_ATTENTE",
    CONFIRME_ADMIN = "CONFIRME_ADMIN",
    CONFIRMATION_COMPLETE = "CONFIRMATION_COMPLETE",
    REJETE = "REJETE"
  }
  
 
  