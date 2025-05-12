export class AdminRegisterRequest {
    // User fields
    email: string;
    password: string;
    role: string;
    enabled: boolean;

    // Société
    societeId?: number;
  
    // Consultant fields
    fullName: string;
    name: string;
    prenom: string;
    telephone: string;
    typeLibelle: string;
    dateRecrutement: string | null; // Dates will be serialized to ISO strings
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