import { Client } from "./client.model";

export interface HistoriqueChiffreAffaire {
  chiffreId?: number;
  annee: string;
  montant: number;
  client: Client
}
