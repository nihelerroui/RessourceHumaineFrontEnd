import { Prestation } from './prestation.model';
import { ContratClient } from './contratClient.models';
import { Consultant } from './consultant.models';
import { CommentaireFactureClient } from './CommentaireFactureClient.models';
import { StatutFacture } from './statut-facture.enum';
import { StatutPaiement } from './statut-paiement.enum';
import { TypePaiement } from './type-paiement.enum';

export interface FactureClient {
  factureClientId?: number;
  refFacture?: string;
  montantHt?: number;
  montantTtc?: number;
  montantTva?: number;
  pourcentageTva?: number;
  dateEmmission?: string; 
  dateEcheance?: string;
  pourcentageRemise?: number;
  filePath?: string;
  numBonCommande?: string;
  objet?: string;
  statutFacture?: StatutFacture;
  statutPaiement?: StatutPaiement;
  typePaiement?: TypePaiement;

  contratClient?: ContratClient;
  consultant?: Consultant;
  prestations?: Prestation[];
  commentairesFactureClient?: CommentaireFactureClient[];
}
