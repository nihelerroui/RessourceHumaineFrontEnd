import { Societe } from "./societe.model";

export interface Caisse {
  caisseId?: number;
  societeId?: number;  
  soldeInitial: number;
  soldeActuel: number;
  entreesTotales: number;
  sortiesTotales: number;
  devise: string;
  dateCreation: string; 
  dateModification: string; 
  motif?: string;

  societe?: Societe;
}
