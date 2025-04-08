import { Facture } from "./facture.model";
import { Societe } from "./societe.model";

export interface Depense {
    depenseId: number;
    mois: string;
    type: string;
    montant: string;
    designation: string;
    motif: string;
    dateCreation: Date;
    facture: Facture;
    societe: Societe;
  }
  
