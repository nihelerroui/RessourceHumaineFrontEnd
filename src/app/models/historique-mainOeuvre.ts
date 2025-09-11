import { Societe } from './societe.model';

export interface HistoriqueMainOeuvre {
  historiqueMainOeuvreId?: number;
  montantTotal: number;
  mois: number;
  annee: number;
  societe?: Societe;
}
