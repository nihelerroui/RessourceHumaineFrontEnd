import { Consultant } from "./consultant.models";

export interface PersonalDetails {
    personalDetailsId?: number;
    attestations?: string;
    bic?: string;
    bisTer?: string;
    carteGrise?: string;
    cni?: string;
    codePostal?: string;
    complementAdr?: string;
    contart?: string;
    dateDebCni?: string; 
    dateFinCni?: string; 
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
  
    consultant?: Consultant; 
  }
  