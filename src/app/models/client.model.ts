import { ContratClient } from "./contratClient.models";
import { Pays } from "./pays.model";
import { Prestation } from "./prestation.model";
import { Societe } from "./societe.model";
import { TypeClient } from "./type-client.enum";

export interface Client {
  clientId: number;
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  numeroSiret?: string;
  typeClient?: TypeClient;
  societe?: Societe;
  pays?: Pays;
  contratClients?: ContratClient[];
  prestations?: Prestation[];
}
