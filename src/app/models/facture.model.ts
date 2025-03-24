import { StatutPaiement } from "./statut-paiement.enum";
import { TypeFacture } from "./type-facture.enum";
import { TypePaiement } from "./type-paiement.enum";

export class Facture {
  factureId?: number;
  designation: string;
  refFacture: string;
  montantTtc: number;
  dateEmmission: Date;
  filePath?: string;
  typeFacture: TypeFacture;
  statutPaiement: StatutPaiement;
  typePaiement: TypePaiement;
  dateModified?: Date;
  consultantId?: number;
}
