import { PersonalDetails } from "./PersonalDetails.model";
import { User } from "./auth.models";
import { Societe } from "./societe.model";

export interface Consultant {
    consultantId: number;
    fullName: string;
    name?: string;
    prenom?: string;
    telephone?: string;
    typeLibelle?: string;
    dateRecrutement?: string; 
    dateSortie?: string;
    fonction?: string;
    matricule?: string;
    isCommercial?: boolean;
  
    societe?: Societe
    user?: User
    personalDetails?: PersonalDetails
}