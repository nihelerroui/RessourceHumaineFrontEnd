import { Societe } from "./societe.model";

export interface Tresorie {
  tresorieId?: number;
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
