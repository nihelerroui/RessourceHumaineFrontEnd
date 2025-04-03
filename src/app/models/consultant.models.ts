export interface Consultant {
    consultantId: number;
    name?: string;
    user?: {
      email: string;
      userId: number;
    };
  }
  