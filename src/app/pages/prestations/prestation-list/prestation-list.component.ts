import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, map, Observable, take } from "rxjs";
import * as PrestationActions from "../../../store/Prestation/prestation.action";
import * as PrestationSelector from "../../../store/Prestation/prestation-selector";
import { Prestation } from "src/app/models/prestation.model";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { loadContratsClient } from "src/app/store/contratClient/contratClient.actions";
import Swal from "sweetalert2";
import { Actions, ofType } from "@ngrx/effects";
import { loadConsultantsBySociete } from "src/app/store/consultant/consultant.actions";
import { selectAllConsultants } from "src/app/store/consultant/consultant-selector";

@Component({
  selector: "app-prestation-list",
  templateUrl: "./prestation-list.component.html",
})
export class PrestationListComponent implements OnInit {
  prestations$: Observable<Prestation[]> = this.store.select(
    PrestationSelector.selectAllPrestations
  );
  loading$: Observable<boolean> = this.store.select(
    PrestationSelector.selectLoading
  );
  error$: Observable<any> = this.store.select(PrestationSelector.selectError);
  total$: Observable<number> = this.store.select(
    PrestationSelector.selectTotalPrestations
  );
  contracts$: Observable<any[]> = this.store.select(
    PrestationSelector.selectAllContrats
  );
  // Observables
  consultants$: Observable<any[]> = this.store.select(selectAllConsultants);
  adminSocietes$: Observable<any[]> = this.store.select(selectAllSocietes);

  // Form & Modals
  form!: FormGroup;
  modalRef?: BsModalRef;
  editMode = false;

  // Filtres
  term: string = "";
  selectedDate: Date | null = null;
  selectedSocieteId: number | "" = "";
  bsConfig = { dateInputFormat: "YYYY-MM-DD" };

  // Pagination
  page = 1;
  prestationsParPage = 5;

  // Utilisateur
  connectedConsultantId: number = 0;
  consultantSocieteId: number = 0;

  // Données
  prestations: Prestation[] = [];
  allPrestation: Prestation[] = [];
  filteredPrestations: Prestation[] = [];
  paginatedPrestations: Prestation[] = [];
  contracts: any[] = [];
  selectedPrestation!: Prestation;

  newContratSelected = false;

  role: string = "";

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private actions$: Actions
  ) { }

  ngOnInit(): void {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    );
    this.connectedConsultantId = currentUser.consultantId;
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = this.consultantSocieteId;
    this.role = currentUser?.user?.role || "";

    this.store.dispatch(AuthActions.loadAdminSocietes());

    if (this.connectedConsultantId) {
      this.store.dispatch(
        loadConsultantsBySociete({ consultantId: this.connectedConsultantId })
      );
    }
    this.store.dispatch(PrestationActions.loadPrestations());
    this.store.dispatch(loadContratsClient());
    this.prestations$.subscribe(prestations => {
      this.allPrestation = prestations;
      this.filterPrestation();
    });
    this.initForms();

    this.prestations$.subscribe((allPrestations) => {
      this.prestations = allPrestations.filter((p) =>
        this.selectedSocieteId
          ? p.consultant?.societe?.societeId === +this.selectedSocieteId
          : p.consultant?.societe?.societeId === this.consultantSocieteId
      );
    });
    this.contracts$.subscribe((contracts) => {
      this.contracts = contracts.filter(c =>
        this.selectedSocieteId
          ? c.client?.societe?.societeId === +this.selectedSocieteId
          : c.client?.societe?.societeId === this.consultantSocieteId
      );
    });

  }
  initForms() {
    this.form = this.fb.group({
      prestationId: [''],
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      contratId: ['', Validators.required],
      externalConsultantId: [''],
      monthYear: ['', Validators.required],
    });
  }
  filterPrestation() {
    const termLower = this.term.toLowerCase().trim();

    this.filteredPrestations = this.allPrestation.filter((p) => {
      const matchesTitle = !this.term || p.titre?.toLowerCase().includes(termLower);

      const matchesDate = !this.selectedDate || new Date(p.createdAt).toDateString() === new Date(this.selectedDate).toDateString();

      const matchesSociete = !this.selectedSocieteId || p.contratClient?.client?.societe?.societeId === +this.selectedSocieteId;

      return matchesTitle && matchesDate && matchesSociete;
    });

    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any) {
    this.page = event.page;
    const start = (this.page - 1) * this.prestationsParPage;
    this.paginatedPrestations = this.filteredPrestations.slice(start, start + this.prestationsParPage);
  }
  refreshList() {
    this.term = '';
    this.selectedDate = null;
    this.selectedSocieteId = '';
    this.page = 1;
    this.filterPrestation();
  }

  openCreateModal(template: TemplateRef<any>) {
    this.editMode = false;
    this.newContratSelected = false;
    this.form.reset();
    this.modalRef = this.modalService.show(template);
  }

  openDetailsModal(prestation: Prestation, template: TemplateRef<any>) {
    this.selectedPrestation = prestation;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  savePrestation(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const [year, month] = formValue.monthYear.split("-").map(Number);

      const prestationData = {
        ...formValue,
        consultantId: this.connectedConsultantId,
        month,
        year,
      };

      this.store.dispatch(
        PrestationActions.createPrestation({ prestation: prestationData })
      );

      this.actions$
        .pipe(ofType(PrestationActions.createPrestationSuccess), take(1))
        .subscribe(() => {
          this.modalRef?.hide();
          Swal.fire({
            icon: "success",
            title: "Prestation ajoutée",
            text: "La prestation a été ajoutée avec succès !",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => this.refreshPrestations());
        });
    }
  }

  editDataGet(prestationId: number, template: TemplateRef<any>) {
    this.editMode = true;
    const prestation = this.prestations.find(
      (p) => p.prestationId === prestationId
    );
    if (!prestation) return;

    const paddedMonth = prestation.month?.toString().padStart(2, "0");
    const monthYearFormatted =
      prestation.year && prestation.month
        ? `${prestation.year}-${paddedMonth}`
        : "";

    this.form.patchValue({
      prestationId: prestation.prestationId,
      titre: prestation.titre,
      description: prestation.description,
      contratId: prestation.contratClient?.contratClientId || "",
      externalConsultantId: prestation.externalConsultantId || "",
      monthYear: monthYearFormatted,
    });

    this.modalRef = this.modalService.show(template);
  }

  updatePrestation(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const [year, month] = formValue.monthYear.split("-").map(Number);

      const prestationData = {
        ...formValue,
        consultantId: this.connectedConsultantId,
        externalConsultantId: formValue.externalConsultantId,
        month,
        year,
      };

      this.store.dispatch(
        PrestationActions.updatePrestation({ prestation: prestationData })
      );

      this.actions$
        .pipe(ofType(PrestationActions.updatePrestationSuccess), take(1))
        .subscribe(() => {
          this.modalRef?.hide();
          Swal.fire({
            icon: "success",
            title: "Prestation modifiée",
            text: "La prestation a été mise à jour avec succès !",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => this.refreshPrestations());
        });
    }
  }

  delete(event: Event, id: number) {
    event.preventDefault();
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(PrestationActions.deletePrestation({ id }));
        Swal.fire(
          "Supprimé !",
          "La prestation a été supprimée avec succès.",
          "success"
        );
      }
    });
  }

  refreshPrestations() {
    this.term = "";
    this.selectedDate = null;
    this.selectedSocieteId = this.consultantSocieteId;
    this.store.dispatch(PrestationActions.loadPrestations());
  }

  onContratChange(value: string) {
    this.newContratSelected = !!value;
  }
}
