import { Pays } from "../pays/pays.models";
import { Societe } from "../societe/societe.models";
import { TypeClient } from "./type-client.enum";

export interface Client {
  clientId: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  numeroSiret: string;
  typeClient: TypeClient;
  societe?: Societe;
  pays?: Pays;
}
