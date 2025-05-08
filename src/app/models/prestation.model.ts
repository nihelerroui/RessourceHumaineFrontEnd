import { Client } from "./client.model"
import { Consultant } from "./consultant.models"
import { ContratClient } from "./contratClient.models";

export interface Prestation {
    prestationId: number;
    titre?:string;
    description?: string;
    prixUnitaire?: number;
    quantite?: number;
    montantHt?: number;
    externalConsultantId?: number;
    createdAt: string;
    year?: number; 
    month?: number;
    client?: Client;
    contratClient?:ContratClient;
    consultant?: Consultant;
  }
  
  
  