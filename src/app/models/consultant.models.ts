import { User } from "../store/Authentication/auth.models";

export interface Consultant {
    consultantId: number;
    name?: string;
    user?: User
  }
  