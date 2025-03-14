import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormGroup,
} from "@angular/forms";
import Swal from "sweetalert2";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DatePipe } from "@angular/common"; // Import DatePipe
import {
  fetchPrestationData,
  deletePrestation,
} from "../../../store/Prestation/prestation.action";
import {
  selectData,
  selectError,
  selectLoading,
} from "../../../store/Prestation/prestation-selector";
import { PrestationService } from "../../../core/services/prestation.service";

@Component({
  selector: "app-prestation-list",
  templateUrl: "./prestation-list.component.html",
  styleUrls: ["./prestation-list.component.scss"],
})
export class PrestationListComponent implements OnInit {
  // Pagination and variables
  page: any = 1;
  term: any;
  searchTerm: any;
  searchResults: any;
  modalRef?: BsModalRef;
  prestationForm!: UntypedFormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  createForm: FormGroup;
  editForm: FormGroup;
  lists?: any[] = [];
  prestations?: any[] = [];
  selectedDate?: string; // Use string for date input binding
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig>;
  breadCrumbItems: Array<{}>;
  contracts$: Observable<any[]>;
  contracts: any[] = [];
  prestationDetailsForm: FormGroup;
  clientDetails: any = {};
  newContratSelected: boolean = false;

  constructor(
    public store: Store,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private prestationService: PrestationService,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.breadCrumbItems = [
      { label: "Prestations" },
      { label: "Prestations List", active: true },
    ];
    this.bsConfig = {
      showWeekNumbers: false,
      dateInputFormat: "YYYY-MM-DD", // Match the date format for the input
    };
  }

  ngOnInit(): void {
    // Initialize forms and fetch data
    this.initializeForms();
    this.store.dispatch(fetchPrestationData());
    this.subscribeToStore();
    this.loadContracts();
  }

  // Initialize forms
  initializeForms() {
    this.prestationForm = this.formBuilder.group({
      consultantId: [140, [Validators.required]],
      contratId: ["", [Validators.required]],
      month: ["", [Validators.required]],
      year: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    this.createForm = this.formBuilder.group({
      consultantId: [140, Validators.required],
      contratId: ["", Validators.required],
      month: ["", Validators.required],
      year: ["", Validators.required],
      description: ["", Validators.required],
    });

    // In ngOnInit() or initializeForms():
    this.editForm = this.formBuilder.group({
      prestationId: ['', Validators.required],
      description: ['', Validators.required],
      // Optional field: if left blank, the contract remains unchanged
      contratId: [''],
      // The month and year fields are required only if a new contrat is chosen.
      month: [''],
      year: [''],
      consultantId: [''] // should be set on load
    });

    this.prestationDetailsForm = this.formBuilder.group({
      description: ["", Validators.required],
      client: ["", Validators.required],
      prixUnitaire: ["", Validators.required],
      quantite: ["", Validators.required],
      montantHt: ["", Validators.required],
      createdAt: ["", Validators.required],
    });
  }

  onContratChange(selectedContrat: string) {
    // If a new contrat is selected (non-empty), show month and year selects.
    this.newContratSelected = !!selectedContrat;
    // Optionally, you can set default month/year if needed.
    if (this.newContratSelected) {
      // For example, set to current month/year
      const now = new Date();
      this.editForm.patchValue({
        month: now.getMonth() + 1, // getMonth() returns 0-indexed value
        year: now.getFullYear()
      });
    } else {
      // Clear month and year if reverting to current contract.
      this.editForm.patchValue({
        month: '',
        year: ''
      });
    }
  }

  viewClientDetails(clientId: number, content: any) {
    if (!clientId) {
      Swal.fire({ icon: "warning", title: "Client Inconnu", text: "Aucune information client disponible." });
      return;
    }
  
    this.prestationService.getClientDetails(clientId).subscribe({
      next: (response) => {
        this.clientDetails = response;
        this.modalRef = this.modalService.show(content, { class: "modal-lg" });
      },
      error: () => Swal.fire({ icon: "error", title: "Erreur", text: "Impossible de récupérer les détails du client." })
    });
  }
  // Subscribe to store data
  subscribeToStore() {
    this.store.select(selectData).subscribe({
      next: (data) => {
        this.prestations = data;
        this.lists = data?.slice(0, 8);
      },
      error: (error) => console.error("Store subscription error:", error),
    });

    this.loading$.subscribe((loading) =>
      console.log("Loading state:", loading)
    );
    this.error$.subscribe((error) => {
      if (error) console.error("Store error:", error);
    });
  }

  // Filter prestations by date
  filterByDate() {
    if (this.selectedDate) {
      const formattedDate = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd");
      this.prestationService.filterByDate(formattedDate!).subscribe({
        next: (response) => {
          this.prestations = response;
          this.lists = response.slice(0, 8);
        },
        error: () => Swal.fire({ icon: "error", title: "Error", text: "Error fetching prestations by date." })
      });
    } else {
      Swal.fire({ icon: "warning", title: "No Date Selected", text: "Please select a date to filter prestations." });
    }
  }

  // Refresh prestations
  refreshPrestations() {
    this.store.dispatch(fetchPrestationData());
    this.selectedDate = undefined; // Clear the selected date
  }

  // Search prestations by term
  searchPrestation() {
    if (this.term && this.prestations) {
      this.lists = this.prestations.filter((data: any) => {
        return (
          data.description.toLowerCase().includes(this.term.toLowerCase()) ||
          (data.client &&
            data.client.nom.toLowerCase().includes(this.term.toLowerCase()))
        );
      });
    } else {
      this.lists = this.prestations?.slice(0, 8);
    }
  }

  // Handle pagination
  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.lists = this.prestations?.slice(startItem, endItem);
  }

  // Open modal for creating a new prestation
  openModal(content: any) {
    this.submitted = false;
    this.isEditMode = false;
    this.prestationForm.reset();
    this.prestationForm.patchValue({ consultantId: 140 });

    setTimeout(() => {
      const modelTitle = document.querySelector(".modal-title") as HTMLElement;
      if (modelTitle) modelTitle.innerHTML = "Add Prestation";

      const addBtn = document.getElementById("add-btn") as HTMLElement;
      if (addBtn) addBtn.innerHTML = "Add Prestation";
    });

    this.modalRef = this.modalService.show(content, { class: "modal-md" });
  }

  // View prestation details
  viewDetails(id: any, content: any) {
    this.prestationService.getPrestationDetails(id).subscribe({
      next: (response) => {
        this.prestationDetailsForm.patchValue({
          description: response.description,
          client: response.client?.nom || "N/A",
          prixUnitaire: response.prixUnitaire,
          quantite: response.quantite,
          montantHt: response.montantHt,
          createdAt: response.createdAt,
        });
        this.modalRef = this.modalService.show(content, { class: "modal-md" });
      },
      error: () => Swal.fire({ icon: "error", title: "Error", text: "Error fetching prestation details." })
    });
  }
  

  // Open modal for creating a new prestation
  openCreateModal(content: any): void {
    this.createForm.reset();
    this.createForm.patchValue({ consultantId: 140 });
    this.loadContracts(); // Ensure contracts are fetched
    this.modalRef = this.modalService.show(content, { class: "modal-md" });
  }

  // Open modal for editing a prestation
  editDataGet(id: any, content: any): void {
    const prestation = this.prestations.find((p) => p.prestationId === id);
    if (prestation) {
      this.editForm.patchValue({
        prestationId: prestation.prestationId,
        description: prestation.description,
        prixUnitaire: prestation.prixUnitaire,
        quantite: prestation.quantite,
        montantHt: prestation.montantHt,
      });
      this.modalRef = this.modalService.show(content, { class: "modal-md" });
    }
  }

  // Save a new prestation
  savePrestation() {
    this.submitted = true;

    if (this.createForm.valid) {
      const prestationDTO = this.createForm.value;
      console.log("Prestation Data being sent:", prestationDTO);

      this.prestationService.createPrestation(prestationDTO).subscribe({
        next: (response) => {
          console.log("Prestation creation response:", response);
          Swal.fire({
            icon: "success",
            title: "Prestation created successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          this.modalRef?.hide();
          this.store.dispatch(fetchPrestationData());
        },
        error: (error) => {
          console.error("Error creating prestation:", error);
          Swal.fire({
            icon: "error",
            title: "Error creating prestation",
            text: error.message,
          });
        },
      });
    }
  }
  updatePrestation() {
    this.submitted = true;
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updatedPrestation: any = {
        prestationId: formValue.prestationId,
        description: formValue.description,
        consultantId: formValue.consultantId
      };

      // Only include contratId, month, and year if a new contrat was selected.
      if (formValue.contratId) {
        updatedPrestation.contratId = formValue.contratId;
        updatedPrestation.month = parseInt(formValue.month, 10);
        updatedPrestation.year = parseInt(formValue.year, 10);
      }
      console.log('Updated prestation data:', updatedPrestation);

      this.prestationService.updatePrestation(updatedPrestation).subscribe({
        next: (response) => {
          console.log('Prestation update response:', response);
          Swal.fire({
            icon: 'success',
            title: 'Prestation updated successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
          this.modalRef?.hide();
          this.store.dispatch(fetchPrestationData());
        },
        error: (error) => {
          console.error('Error updating prestation:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error updating prestation',
            text: error.message,
          });
        },
      });
    }
  }

  // Delete a prestation
  delete(event: any, id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.store.dispatch(deletePrestation({ id }));
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Votre prestation a été supprimer.",
            "success"
          );
          event.target.closest("tr")?.remove();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your prestation is safe :)",
            "error"
          );
        }
      });
  }

  // Load contracts
  loadContracts() {
    this.prestationService.getContrats().subscribe({
      next: (data) => {
        this.contracts = data;
        console.log("Contracts loaded:", this.contracts);
      },
      error: (error) => console.error("Error fetching contracts:", error),
    });
  }
  

  // Get contrat name by ID
  getContratName(contratId: number | string): string {
    const id =
      typeof contratId === "string" ? parseInt(contratId, 10) : contratId;
    const contrat = this.contracts.find((c) => c.contratClientId === id);
    return contrat ? contrat.designation : "N/A";
  }
}
