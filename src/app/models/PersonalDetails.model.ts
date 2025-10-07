
import { Pays } from "./pays.model";

export class PersonalDetails {
  personalDetailsId: number;
  attestations: string | null;
  bic: string | null;
  bisTer: string | null;
  carteGrise: string | null;
  cni: string | null;
  codePostal: string | null;
  complementAdr: string | null;
  contart: string | null;
  dateDebCni: string | null;
  dateFinCni: string | null;
  iban: string | null;
  kbis: string | null;
  navigo: string | null;
  nomRue: string | null;
  numRue: string | null;
  numss: string | null;
  photo: string | null;
  rib: string | null;
  urssaf: string | null;
  ville: string | null;
  pays: Pays | null;
  paysId: number;

  constructor(init?: Partial<PersonalDetails>) {
    Object.assign(this, init);
  }

  getpaysId(): number {
    return this.paysId;
  }

  getId(): number {
    return this.personalDetailsId;
  }
}
