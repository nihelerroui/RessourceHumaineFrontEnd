import { Societe } from "./societe.model";
import { SourceFinancement } from "./SourceFinancement.enum";

export interface Recette {
  recetteId: number;
  montant: number;
  source: string;
  motif: string;
  dateCreation: string;
  societe: Societe
  sourceFinancement : SourceFinancement ;
}
