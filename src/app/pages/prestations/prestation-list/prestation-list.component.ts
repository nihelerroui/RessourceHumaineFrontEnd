import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, map, Observable, take } from "rxjs";
import {
  loadPrestations,
  createPrestation,
  updatePrestation,
  deletePrestation,
  createPrestationSuccess,
  updatePrestationSuccess,
} from "../../../store/Prestation/prestation.action";
import {
  selectAllPrestations,
  selectLoading,
  selectError,
  selectTotalPrestations,
  selectAllContrats,
} from "../../../store/Prestation/prestation-selector";
import { Prestation } from "src/app/models/prestation.model";
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
  prestations$: Observable<Prestation[]> = this.store.select(selectAllPrestations);
  loading$: Observable<boolean> = this.store.select(selectLoading);
  error$: Observable<any> = this.store.select(selectError);
  total$: Observable<number> = this.store.select(selectTotalPrestations);
  contracts$: Observable<any[]> = this.store.select(selectAllContrats);
  consultants$: Observable<any[]> = this.store.select(selectAllConsultants);


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
  newContratSelected = false;

  editMode = false;
  contracts: any[] = [];

  constructor(
    private store: Store,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    const connectedConsultantId = 141; 
  this.store.dispatch(loadConsultantsBySociete({ consultantId: connectedConsultantId }));
    this.store.dispatch(loadPrestations());
    this.store.dispatch(loadContratsClient());
    this.initForms();

    this.prestations$.subscribe((data) => {
      this.prestations = data;
      this.updatePagination();
    });

    this.contracts$.subscribe((contracts) => {
      this.contracts = contracts;
    });
  }

  initForms() {
    this.form = this.fb.group({
      prestationId: [""],
      titre: ["", Validators.required],
      description: ["", Validators.required],
      contratId: [""],
      externalConsultantId: [""],
      monthYear: ["", Validators.required], 
    });
  }

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
      const [year, month] = formValue.monthYear.split("-").map(Number); // Extrait mois et année
  
      const prestationData = {
        ...formValue,
        consultantId: 141,
        month,
        year
      };
  
      this.store.dispatch(createPrestation({ prestation: prestationData }));
  
      this.actions$.pipe(ofType(createPrestationSuccess), take(1)).subscribe(() => {
        this.modalRef?.hide();
        Swal.fire({
          icon: 'success',
          title: 'Prestation ajoutée',
          text: 'La prestation a été ajoutée avec succès !',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => this.refreshPrestations());
      });
    }
  }

  editDataGet(prestationId: number, template: TemplateRef<any>) {
    this.editMode = true;
    const prestation = this.prestations.find(p => p.prestationId === prestationId);
    if (!prestation) return;
  
    const paddedMonth = prestation.month?.toString().padStart(2, '0');
    const monthYearFormatted = prestation.year && prestation.month ? `${prestation.year}-${paddedMonth}` : '';
  
    this.form.patchValue({
      prestationId: prestation.prestationId,
      titre: prestation.titre,
      description: prestation.description,
      contratId: prestation.contratClient?.contratClientId || '',
      externalConsultantId: prestation.externalConsultantId || '',
      monthYear: monthYearFormatted
    });
  
    this.modalRef = this.modalService.show(template);
  }
  
  updatePrestation(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const [year, month] = formValue.monthYear.split("-").map(Number); 
  
      const prestationData = {
        ...formValue,
        consultantId: 141, // l'admin connecté
        externalConsultantId: formValue.externalConsultantId, 
        month,
        year
      };
  
      this.store.dispatch(updatePrestation({ prestation: prestationData }));
  
      this.actions$.pipe(ofType(updatePrestationSuccess), take(1)).subscribe(() => {
        this.modalRef?.hide();
        Swal.fire({
          icon: 'success',
          title: 'Prestation modifiée',
          text: 'La prestation a été mise à jour avec succès !',
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(deletePrestation({ id }));
        Swal.fire("Supprimé !", "La prestation a été supprimée avec succès.", "success");
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
