import { PersonalDetails } from "./PersonalDetails.model";
import { Users } from "./Users.model";
import { Societe } from "./societe.model";

export class Consultant {
  consultantId: number;
  dateRecrutement: string | null;
  dateSortie: string | null;
  fonction: string | null;
  fullName: string | null;
  isCommercial: boolean;
  nom: string | null;
  prenom: string | null;
  telephone: string | null;
  typeLibelle: string | null;
  matricule: string | null;

  societe: Societe | null;
  personalDetails: PersonalDetails | null;
  users: Users | null;
  societeId: number;
  usersId: number;
  personalDetailsId: number;
 
  constructor(init?: Partial<Consultant>) {
    Object.assign(this, init);
  }

  getSocieteId(): number {
    return this.societeId;
  }

  getId(): number {
    return this.consultantId;
  }
}