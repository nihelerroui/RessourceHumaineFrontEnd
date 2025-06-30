export interface Tresorerie {
  tresorerieId?: number;
  soldeInitial: number;
  soldeActuel?: number;
  dateCreation?: Date;
  dateModification?: Date;
  entreesTotales?: number;
  sortiesTotales?: number;
  devise?: string;
  motif?: string;
  societe: any;
}
