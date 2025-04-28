import { Consultant } from "./consultant.models";

export interface MainOeuvre {
  mainoeuvreId?: number;
  coutGlobale: number;
  mois: number;
  annee: number;
  consultant: Consultant ;
}
