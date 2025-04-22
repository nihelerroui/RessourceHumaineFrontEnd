export interface MainOeuvre {
  mainoeuvreId?: number;
  coutGlobale: number;
  mois: number;
  annee: number;
  consultant: {
    consultantId: number;
    fullName: string;
    societe: {
      societeId: number;
      name?: string;
    };
  };
}
