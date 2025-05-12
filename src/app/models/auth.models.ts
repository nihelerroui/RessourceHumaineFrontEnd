import { Consultant } from "src/app/models/consultant.models";
import { UserRole } from "./userRole.enum";

export class User {
  userId: number;
    email: string;
    password: string;
    role: UserRole;
    token?: string | null;
    tokenCreationDate?: string | null;
    enabled: boolean;
    consultant?: Consultant;
    
}

