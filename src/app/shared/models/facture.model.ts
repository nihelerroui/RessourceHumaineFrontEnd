// src/app/shared/models/facture.model.ts
export interface Facture {
    factureId: number;
    designation: string;
    refFacture: string;
    montantTtc: number;
    dateEmmission: Date;
    filePath: string;
    statutFacture: string;
    typeFacture: string;
    statutPaiement: string;
    typePaiement: string;
    dateModified: Date;
  }