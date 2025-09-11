export interface ScoreSante {
  nomSociete: string;
  margeNettePourcent: number;
  ratioDepenseRecette: number;
  tresorerieCritique: boolean;
  scoreTotal: number;
  niveau: 'STABLE' | 'À SURVEILLER' | 'EN RISQUE';
}
