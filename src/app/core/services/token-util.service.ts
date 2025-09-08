import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenUtilService {
  extractClientId(token: string): number | null {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Token vide ou invalide');
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Format de token JWT invalide');
      }

      const base64Url = parts[1];
      const payloadJson = this.decodeBase64Url(base64Url);
      const payload = JSON.parse(payloadJson);

      if (!payload.sub) {
        throw new Error('Le champ "sub" est manquant dans le token');
      }

      return parseInt(payload.sub);
    } catch (error) {
      console.error('❌ Erreur lors de l’extraction du clientId :', error);
      return null;
    }
  }
  isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const exp = payload.exp;
    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return now > exp;  // true si expiré
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token :', error);
    return true;
  }
}
  private decodeBase64Url(base64Url: string): string {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = 4 - (base64.length % 4);
    const padded = base64 + '='.repeat(padLength === 4 ? 0 : padLength);
    return atob(padded);
  }
}
