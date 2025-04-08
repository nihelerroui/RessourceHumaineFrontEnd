export interface Depense {
    depenseId: number;
    mois: string;
    type: string;
    montant: string;
    designation: string;
    motif: string;
    dateCreation: Date;
    facture: Facture;
    societe: Societe;
  }
  
  export interface Facture {
    factureId: number;
    reference: string; // Add other fields as needed
  }
  
  export interface Societe {
    societeId: number;
    nom: string; // Add other fields as needed
  }