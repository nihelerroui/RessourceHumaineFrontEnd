export interface ContratSousTraitant {
  contratId?: number;
  dateDebut: string; // format yyyy-MM-dd
  dateFin: string;
  tjm: number;
  conditionsFac: string;
  statutContrat: string;
  filePath?: string; // Chemin du fichier
}

  export enum StatutContrat {
    EN_COURS = 'EN_COURS',
    TERMINE = 'TERMINE',
    ANNULÉ = 'ANNULÉ'
  }
  
 
  