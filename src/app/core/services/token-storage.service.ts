import { Injectable } from "@angular/core";

const TOKEN_KEY = "auth-token";
const USER_KEY = "currentUser";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  constructor() {}

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(isExcludedRoute: boolean): string | null {
    const clientToken = localStorage.getItem("clientToken");
    const authToken = localStorage.getItem("token");
    if (isExcludedRoute) {
      if (clientToken && clientToken !== "null") {
        return clientToken;
      }
    } else {
      if (authToken && authToken !== "null") {
        return authToken;
      }
    }

    return null;
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);

    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  getRole(): string | null {
    const user = this.getUser();
    return user?.user?.role || null;
  }
}
