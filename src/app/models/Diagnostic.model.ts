import { ScoreSante } from "./ScoreSante.model";

export interface Diagnostic extends ScoreSante {
  recommandations: string[];
}
