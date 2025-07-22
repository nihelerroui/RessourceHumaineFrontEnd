import { StatutPaiement } from "./statut-paiement.enum";

export interface FactureSousTraitant {
  idFactureIndep: number;
  filePath: string;
  monthId: number;
  yearId: number;
  dateUpload: string;
  owner: number;
  consultantId: number;
  montantTTC: number;
  statutPaiement: StatutPaiement; 
}
