import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { fetchDepenseData } from "../../../store/Depense/depense.actions";
import {
  selectData,
  selectError,
  selectLoading,
} from "../../../store/Depense/depense.selectors";
import { Depense } from "src/app/models/depense.model";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";

@Component({
  selector: "app-depense-list",
  templateUrl: "./depense-list.component.html",
  styleUrls: ["./depense-list.component.scss"],
})
export class DepenseListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  modalRef?: BsModalRef;
  selectedDepense!: Depense | null;
  lists: Depense[] = [];
  depenses: Depense[] = [];
  depensesFiltrees: Depense[] = [];
  term: string = "";
  moisSelectionne: string = "";

  loading$!: Observable<boolean>;
  error$!: Observable<any>;

  listeMois: string[] = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  selectedSocieteId!: number;
  consultantSocieteId!: number;
  adminSocietes: any[] = [];

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dépenses", path: "/" },
      { label: "Liste des Dépenses", active: true },
    ];
    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;

    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.adminSocietes = societes;

      const matchingSociete = this.adminSocietes.find(
        (s) => s.societeId === this.consultantSocieteId
      );
      if (!matchingSociete && this.adminSocietes.length > 0) {
        this.selectedSocieteId = this.adminSocietes[0].societeId;
      }

      this.filtrerDepenses();
    });

    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);

    this.store.dispatch(fetchDepenseData());

    this.store.select(selectData).subscribe((data) => {
      this.depenses = data;
      this.filtrerDepenses();
    });

    this.store.select(selectData).subscribe((data) => {
      this.depenses = data;
      this.filtrerDepenses();
    });
  }

  openDetailsModal(depense: Depense, template: TemplateRef<any>) {
    this.selectedDepense = depense;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  filtrerDepenses(): void {
    const terme = this.term?.toLowerCase() || "";

    this.depensesFiltrees = this.depenses.filter(
      (d) =>
        d.societe?.societeId === this.selectedSocieteId &&
        (!this.moisSelectionne ||
          d.mois?.toLowerCase() === this.moisSelectionne.toLowerCase()) &&
        (!terme ||
          d.designation?.toLowerCase().includes(terme) ||
          d.motif?.toLowerCase().includes(terme))
    );

    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.lists = this.depensesFiltrees.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
}
