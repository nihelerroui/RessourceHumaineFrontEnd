export enum UserRole {
    ADMINISTRATEUR = 'ADMINISTRATEUR',
    RESPONSABLE_FINANCIER = 'RESPONSABLE_FINANCIER',
    SOUS_TRAITANT = 'SOUS_TRAITANT',
    CONSULTANT = 'CONSULTANT'
  }
  
  export interface Consultant {
    consultantId: number;
    fullName: string;
    name: string;
    prenom: string;
    telephone: string;
    typeLibelle: string;
    dateRecrutement: string; // ISO date string, e.g. "2025-03-21"
    dateSortie?: string | null; // Optional or nullable if not applicable
    fonction: string;
    matricule: string;
    isCommercial: boolean;
    // Collections and related entities can be added as optional properties
    contratSousTraitants?: any[];
    facturesClient?: any[];
    factures?: any[];
    mainOeuvres?: any[];
    societe?: any; // You can create a separate interface if needed
    personalDetails?: any; // You can create a separate interface if needed
  }
  
  export interface User {
    userId: number;
    email: string;
    password: string;
    role: UserRole;
    token?: string | null;
    tokenCreationDate?: string | null; // ISO date string
    enabled: boolean;
    consultant?: Consultant;
  }
  