import { Component, OnInit } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
import { MainOeuvre } from "src/app/models/mainOeuvre.model";
import {
  loadMainOeuvre,
  verifierMiseAJourMainOeuvre,
} from "src/app/store/mainOeuvre/mainOeuvre.actions";
import {
  selectMainOeuvreData,
  selectMainOeuvreLoading,
} from "src/app/store/mainOeuvre/mainOeuvre.selectors";
import Swal from "sweetalert2";
import * as MainOeuvreActions from "src/app/store/mainOeuvre/mainOeuvre.actions";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";

@Component({
  selector: "app-main-oeuvre-list",
  templateUrl: "./main-oeuvre-list.component.html",
  styleUrls: ["./main-oeuvre-list.component.css"],
})
export class MainOeuvreListComponent implements OnInit {
  mainOeuvreList$: Observable<MainOeuvre[]>;
  loading$: Observable<boolean>;

  mois: number = 3;
  annee: number = 2025;
  montantTotal: number = 0;

  searchTerm: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;

  mainOeuvre: MainOeuvre[] = [];
  filteredMainOeuvre: MainOeuvre[] = [];
  paginatedMainOeuvre: MainOeuvre[] = [];

  consultantId!: number;
  societeId: number | undefined;

  adminSocietes$: Observable<any[]> = this.store.select(selectAllSocietes);
  selectedSocieteId: number | "" = "";

  role : string ="";

  constructor(private store: Store, private actions$: Actions) {
    this.mainOeuvreList$ = this.store.select(selectMainOeuvreData);
    this.loading$ = this.store.select(selectMainOeuvreLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadAdminSocietes());

    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    this.consultantId = currentUser.consultantId;
    this.societeId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.societeId;
    this.role = currentUser.user?.role;

    this.store.dispatch(loadMainOeuvre());

    this.mainOeuvreList$.subscribe((list) => {
      this.mainOeuvre = list;

      if (!this.societeId) {
        const consultant = list.find(
          (m) => m.consultant?.consultantId === this.consultantId
        );
        this.societeId = consultant?.consultant?.societe?.societeId;
      }

      this.filtrerMainOeuvre();
      this.montantTotal = this.filteredMainOeuvre.reduce(
        (acc, item) => acc + item.coutGlobale,
        0
      );
    });
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMainOeuvre = this.filteredMainOeuvre.slice(
      startIndex,
      endIndex
    );
  }

  filtrerMainOeuvre() {
    this.filteredMainOeuvre = this.mainOeuvre.filter(
      (m) =>
        (!this.searchTerm ||
          m.consultant?.fullName
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase())) &&
        (!this.selectedSocieteId ||
          m.consultant?.societe?.societeId === +this.selectedSocieteId)
    );

    this.pageChanged({ page: 1 });
    this.montantTotal = this.filteredMainOeuvre.reduce(
      (acc, item) => acc + item.coutGlobale,
      0
    );
  }

  verifierMiseAJour() {
    const adminId = 141;
    this.store.dispatch(
      verifierMiseAJourMainOeuvre({
        adminId,
        mois: this.mois,
        annee: this.annee,
      })
    );

    this.actions$
      .pipe(
        ofType(MainOeuvreActions.verifierMiseAJourMainOeuvreSuccess),
        take(1)
      )
      .subscribe(() => {
        Swal.fire({
          icon: "success",
          title: "Extraction réussie",
          text: "Les données ont été extraites avec succès.",
        }).then(() => {
          this.store.dispatch(loadMainOeuvre());
        });
      });

    this.actions$
      .pipe(
        ofType(MainOeuvreActions.verifierMiseAJourMainOeuvreFailure),
        take(1)
      )
      .subscribe(({ error }) => {
        Swal.fire({
          icon: "error",
          title: "Erreur lors de l’extraction",
          text: error || "Une erreur est survenue.",
        });
      });
  }
}
