export class JwtResponse {
    token: string;

    constructor(init?: Partial<JwtResponse>) {
        Object.assign(this, init);
    }
}