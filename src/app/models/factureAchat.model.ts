import { Societe } from "./societe.model";
import { StatutPaiement } from "./statut-paiement.enum";
import { TypePaiement } from "./type-paiement.enum";

export class FactureAchat {
  factureAchatId?: number;
  designation: string;
  refFacture: string;
  montantTtc: number;
  dateEmmission: Date;
  filePath?: string;
  statutPaiement: StatutPaiement;
  typePaiement: TypePaiement;
  dateModified?: Date;
  consultantId?: number;
  societe?:Societe;
}
