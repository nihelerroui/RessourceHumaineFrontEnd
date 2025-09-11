
import { FactureAchat } from "./factureAchat.model";
import { Societe } from "./societe.model";
import { SourceFinancement } from "./SourceFinancement.enum";

export interface Depense {
    depenseId: number;
    mois: string;
    type: string;
    montant: string;
    designation: string;
    motif: string;
    dateCreation: Date;
    facture: FactureAchat;
    societe: Societe;
    sourceFinancement : SourceFinancement ;
  }
  
