import { Societe } from "./societe.model";

export interface Recette {
  recetteId: number;
  montant: number;
  source: string;
  motif: string;
  dateCreation: string;
  societe: Societe
}
