import { Client } from "./client.model"
import { Consultant } from "./consultant.models"
import { ContratClient } from "./contratClient.models";

export interface Prestation {
    prestationId: number;
    description?: string;
    prixUnitaire?: number;
    quantite?: number;
    montantHt?: number;
    createdAt: string;
    year?: number; 
    month?: number;
    client?: Client;
    contratClient?:ContratClient;
    consultant?: Consultant;
  }
  
  export interface PrestationDTO {
    prestationId: number; 
    consultantId?: number;
    contratId?: number;
    month?: number;
    year?: number;
    description?: string;
  }
  
  
  