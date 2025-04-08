import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenUtilService {
  extractClientId(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.sub);
    } catch (error) {
      console.error('Erreur lors de l’extraction du clientId :', error);
      return null;
    }
  }
}
