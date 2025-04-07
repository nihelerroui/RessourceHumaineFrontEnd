import { Client } from "./client.model";

export interface ContratClient {
  contratClientId?: number;
  designation?: string;
  tjm: number;
  filePath?: string;
  statutContrat: string;
  client?: Client
}

export enum StatutContrat {
  EN_ATTENTE = "EN_ATTENTE",
  CONFIRME_ADMIN = "CONFIRME_ADMIN",
  CONFIRMATION_COMPLETE = "CONFIRMATION_COMPLETE",
  REJETE = "REJETE",
}
