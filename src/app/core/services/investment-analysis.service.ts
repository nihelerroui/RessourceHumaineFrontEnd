import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface InvestmentAnalysisRequest {
  montantInvestissement: number;
  seuilSecurite?: number;
  societeId?: number;
  dateFin?: string;
}

export interface MoisOpportunite {
  mois_key: string;
  nom_mois: string;
  solde_avant_investissement: number;
  solde_apres_investissement: number;
  marge_securite: number;
  score_opportunite: number;
  risque_niveau: string;
}

export interface InvestmentAnalysisResponse {
  status: string;
  analyse: {
    montant_investissement: number;
    seuil_securite: number;
    meilleur_moment: MoisOpportunite;
    alternatives: MoisOpportunite[];
    mois_impossibles: any[];
    recommandations: Array<{
      type: string;
      message: string;
    }>;
    analyse_risque: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class InvestmentAnalysisService {
  protected pythonUrl: string;

  constructor(private http: HttpClient) {
    this.pythonUrl = `${environment.apiUrl}`;
  }

  analyzeInvestment(request: InvestmentAnalysisRequest): Observable<InvestmentAnalysisResponse> {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const token = currentUser.token;
    const societeId = currentUser.societe?.societeId;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const params = new URLSearchParams({
      societeId: societeId?.toString() || '',
      dateFin: request.dateFin || '2025-12-30'
    });

    const body = {
      montantInvestissement: request.montantInvestissement,
      seuilSecurite: request.seuilSecurite || 5000
    };

    return this.http.post<InvestmentAnalysisResponse>(
      `${this.pythonUrl}/analyser-investissement?${params}`,
      body,
      { headers }
    );
  }

}