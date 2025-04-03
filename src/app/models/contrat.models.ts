import { Consultant } from "./consultant.models";

export interface ContratSousTraitant {
  contratId?: number;
  dateDebut: string;
  dateFin: string;
  tjm: number;
  conditionsFac: string;
  statutContrat: string;
  filePath?: string;
  designation?: string;
  consultant: Consultant;
}

  export enum StatutContrat {
    EN_ATTENTE = "EN_ATTENTE",
    CONFIRME_ADMIN = "CONFIRME_ADMIN",
    CONFIRMATION_COMPLETE = "CONFIRMATION_COMPLETE",
    REJETE = "REJETE"
  }
  
 
  