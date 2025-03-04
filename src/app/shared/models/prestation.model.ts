export interface Prestation {
    prestationId: number
    description: string
    prixUnitaire: number
    quantite: number
    montantHt: number
    client: any
  }
  
  export interface PrestationDTO {
    consultantId: number
    contratId: number
    month: number
    year: number
    description: string
  }
  
  