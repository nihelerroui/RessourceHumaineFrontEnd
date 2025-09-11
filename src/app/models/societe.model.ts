export interface Societe {
    societeId?: number;
    nom: string;
    adresse: string;
    contact: string;
    email: string;
    numSiret: string;
    numTva: string;
    telephone: string;
    seuilTresorerie?: number;
    responsable: string;

    niveauSante?: 'STABLE' | 'À SURVEILLER' | 'EN RISQUE';
    scoreTotal?: number;
  }
  