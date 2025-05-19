import { Consultant } from "src/app/models/consultant.models";
import { UserRole } from "./userRole.enum";

export class User {
  userId: number;
    email: string;
    password: string;
    role: UserRole;
    token?: string | null;
    tokenCreationDate?: string | null;
    enabled: boolean; 
}

export interface ProfileUpdateRequest {
  // User fields
  email: string;
  
  // Consultant fields
  fullName: string;
  name: string;
  prenom: string;
  telephone: string;
  typeLibelle: string;
  dateRecrutement: string | null;
  dateSortie: string | null;
  fonction: string;
  matricule: string;
  commercial: boolean;

  // PersonalDetails fields (all optional)
  attestations?: string;
  bic?: string;
  bisTer?: string;
  carteGrise?: string;
  cni?: string;
  codePostal?: string;
  complementAdr?: string;
  contart?: string;
  dateDebCni?: string | null;
  dateFinCni?: string | null;
  iban?: string;
  kbis?: string;
  navigo?: string;
  nomRue?: string;
  numRue?: string;
  nummss?: string;
  photo?: string;
  rib?: string;
  urssaf?: string;
  ville?: string;
}

