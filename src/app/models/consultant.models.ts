import { User } from "./auth.models";
import { PersonalDetails } from "./PersonalDetails.model";
import { Societe } from "./societe.model";


export interface Consultant {
  consultantId: number;
  fullName?: string;
  name?: string;
  prenom?: string;
  telephone?: string;
  typeLibelle?: string;
  dateRecrutement?: string;
  dateSortie?: string;
  fonction?: string;
  matricule?: string;
  isCommercial?: boolean;
  user?: User;
  societe?:Societe;
  personalDetails?: PersonalDetails;
}

