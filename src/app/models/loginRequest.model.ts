export class LoginRequest {
    email: string;
    password: string;


    constructor(init?: Partial<LoginRequest>) {
      Object.assign(this, init);
  }
  }
  