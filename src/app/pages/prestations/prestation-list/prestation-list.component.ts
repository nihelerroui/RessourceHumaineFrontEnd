import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, map, Observable } from "rxjs";
import { loadPrestations, createPrestation, updatePrestation, deletePrestation } from "../../../store/Prestation/prestation.action";
import { selectAllPrestations, selectLoading, selectError, selectTotalPrestations, selectAllContrats } from "../../../store/Prestation/prestation-selector";
import { Prestation } from "src/app/models/prestation.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { loadContratsClient } from "src/app/store/contratClient/contratClient.actions";
import Swal from "sweetalert2";

@Component({
  selector: "app-prestation-list",
  templateUrl: "./prestation-list.component.html",
})
export class PrestationListComponent implements OnInit {
  prestations$: Observable<Prestation[]> = this.store.select(selectAllPrestations);
  loading$: Observable<boolean> = this.store.select(selectLoading);
  error$: Observable<any> = this.store.select(selectError);
  total$: Observable<number> = this.store.select(selectTotalPrestations);
  contracts$: Observable<any[]> = this.store.select(selectAllContrats);

  prestations: Prestation[] = [];
  form!: FormGroup;
  selectedPrestation!: Prestation;

  term: string = "";
  selectedDate: Date | null = null;
  bsConfig = { dateInputFormat: "YYYY-MM-DD" };

  page = 1;
  prestationsParPage = 5;

  prestationsPagination$: Observable<Prestation[]> = new Observable();
  filteredPrestations$: Observable<Prestation[]> = new Observable();

  modalRef?: BsModalRef;
  editMode = false;
  newContratSelected = false;
  contracts: any[] = [];

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.prestations$ = this.store.select(selectAllPrestations);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadPrestations());
    this.store.dispatch(loadContratsClient());
    this.initForms();
    this.prestations$.subscribe((data) => {
      this.prestations = data;
      this.updatePagination();
    });

    this.store.select(selectAllContrats).subscribe((contracts) => {
      console.log(contracts);
      this.contracts = contracts;
    });
  }
  initForms() {
    this.form = this.fb.group({
      prestationId: [""],
      description: ["", Validators.required],
      contratId: [""],
      month: ["", Validators.required],
      year: ["", Validators.required],
      consultantId: [""],
    });
  }
  //pagination
  updatePagination() {
    this.prestationsPagination$ = combineLatest([this.prestations$]).pipe(
      map(([prestations]) => {
        const start = (this.page - 1) * this.prestationsParPage;
        return prestations.slice(start, start + this.prestationsParPage);
      })
    );
    this.filteredPrestations$ = this.prestationsPagination$;
  }
  openCreateModal(template: TemplateRef<any>) {
    this.editMode = false;
    this.form.reset();
    this.modalRef = this.modalService.show(template);
  }
  openDetailsModal(prestation: Prestation, template: TemplateRef<any>) {
    this.selectedPrestation = prestation;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  savePrestation() {
    if (this.form.valid) {
      const prestation: Prestation = this.form.value;
      this.store.dispatch(createPrestation({ prestation }));
      this.modalRef?.hide();
      this.form.reset();
    }
  }
  editDataGet(prestationId: number, template: TemplateRef<any>) {
    this.editMode = true;
    const prestation = this.prestations.find(p => p.prestationId === prestationId);
    if (!prestation) return;

    this.form.patchValue({
      prestationId: prestation.prestationId,
      description: prestation.description,
      contratId: prestation.contratClient?.contratClientId || '',
      month: prestation.month || '',
      year: prestation.year || '',
      consultantId: prestation.consultant?.consultantId || ''
    });

    this.modalRef = this.modalService.show(template);
  }
  updatePrestation() {
    const prestation: Prestation = this.form.value;
    this.store.dispatch(updatePrestation({ prestation }));
    this.modalRef?.hide();
  }

  delete(event: Event, id: number) {
    event.preventDefault();
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(deletePrestation({ id }));
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
    this.store.dispatch(loadPrestations());
  }

  filterByDate() {
    this.filteredPrestations$ = this.prestations$.pipe(
      map((prestations) => {
        return prestations.filter((p) => {
          const matchesDescription = p.description
            ?.toLowerCase()
            .includes(this.term.toLowerCase());

          let matchesDate = true;
          if (this.selectedDate) {
            const formattedDate = this.selectedDate.toISOString().split("T")[0];
            const prestationDate = new Date(p.createdAt)
              .toISOString()
              .split("T")[0];
            matchesDate = prestationDate === formattedDate;
          }

          return matchesDescription && matchesDate;
        });
      }),
      map((filtered) => {
        const start = (this.page - 1) * this.prestationsParPage;
        return filtered.slice(start, start + this.prestationsParPage);
      })
    );
  }

  onContratChange(value: string) {
    this.newContratSelected = !!value;
  }
}