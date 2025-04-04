import { User } from "../store/Authentication/auth.models";


export interface Consultant {
  consultantId: number;
  fullName?: string;
  name?: string;
  prenom?: string;
  telephone?: string;
  typeLibelle?: string;
  dateRecrutement?: string;
  dateSortie?: string;
  fonction?: string;
  matricule?: string;
  isCommercial?: boolean;

  user?: User;
}
