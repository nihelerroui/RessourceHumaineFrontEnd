import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MoisCritiqueRequest {
    societeId: number;
    dateFin?: string;
}
export interface MoisCritiqueResponse {
    mois_critique?: {
        mois_key: string;
        nom_mois: string;
        solde_fin: number;
        flux_net: number;
        entrees: number;
        sorties: number;
    };
    periode_analyse?: string;
    projection_detaillee?: any[];
}

@Injectable({
    providedIn: 'root'
})
export class MoisCritiqueService {
    protected pythonUrl: string;

    constructor(private http: HttpClient) {
        this.pythonUrl = `${environment.baseUrl}`;
     }
    getCriticalMonth(dateFin?: string): Observable<MoisCritiqueResponse> {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const token = currentUser.token;
        const societeId = currentUser.societe?.societeId;

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        const params = new HttpParams()
            .set('societeId', societeId?.toString() || '')
            .set('dateFin', dateFin || '2025-12-30');


        return this.http.get<MoisCritiqueResponse>(
            `${this.pythonUrl}/mois-critique?${params}`,
            { headers }
        );
    }
}