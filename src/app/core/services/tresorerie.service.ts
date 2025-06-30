import { Injectable } from "@angular/core";
import { Tresorerie } from "src/app/models/Tresorerie.model";
import { GenericService } from "./generic.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TresorerieService extends GenericService<Tresorerie> {
  constructor(protected override http: HttpClient) {
    super(http, "tresorerie");
  }
  getTresorerieBySociete(societeId: number): Observable<Tresorerie> {
    return this.http.get<Tresorerie>(`${this.apiUrl}/by-societe/${societeId}`);
  }

  createTresorerie(tresorerie: Tresorerie): Observable<Tresorerie> {
    return this.http.post<Tresorerie>(`${this.apiUrl}`, tresorerie);
  }
}
