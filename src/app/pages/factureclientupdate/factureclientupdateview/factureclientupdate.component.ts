import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef  } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { FactureClientService } from "../../../core/services/factureclient.service";
import { Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { forkJoin } from "rxjs";
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from "sweetalert2";

@Component({
  selector: "app-factureclientupdate",
  templateUrl: "./factureclientupdate.component.html",
})
export class FactureClientUpdateComponent implements OnInit {
  @Input() factureClientId!: number; // ID of the facture to update
  factureForm: FormGroup;
  prestations: any[] = [];
  availablePrestations: any[] = [];
  contratsClient: any[] = [];
  selectedContrat: any = null;
  facturePreview: any = null;
  bsConfig: Partial<BsDatepickerConfig>;
  isLoading = false;
  today = new Date();
  @Output() factureUpdated = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private factureClientService: FactureClientService,
    private router: Router,
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef
  ) {
    this.bsConfig = {
      dateInputFormat: "DD/MM/YYYY",
      containerClass: "theme-default",
    };

    // Include factureClientId in the form for update
    this.factureForm = this.fb.group({
      factureClientId: [null, Validators.required],
      contratId: [null, Validators.required],
      refFacture: ["", Validators.required],
      dateEmmission: [new Date(), Validators.required],
      dateEcheance: [
        new Date(new Date().setDate(new Date().getDate() + 30)),
        Validators.required,
      ],
      pourcentageTva: [20, Validators.required],
      pourcentageRemise: [0],
      objet: ["", Validators.required],
      numBonCommande: [""],
      typePaiement: ["VIREMENT", Validators.required],
      prestationIds: this.fb.array([]),
    });
  }

  get prestationIds(): FormArray {
    return this.factureForm.get("prestationIds") as FormArray;
  }

  ngOnInit(): void {
    this.isLoading = true;

    // Fetch prestations and contracts
    forkJoin({
      prestations: this.factureClientService.getPrestations(),
      contrats: this.factureClientService.getContratsClient(),
    }).subscribe({
      next: (result) => {
        this.prestations = result.prestations;
        this.availablePrestations = [...this.prestations];
        this.contratsClient = result.contrats;
        this.isLoading = false;
        // After loading prestations and contracts, load the facture to update
        this.loadFactureData();
      },
      error: (error) => {
        console.error("Error fetching data:", error);
        this.isLoading = false;
      },
    });
    this.cdr.detectChanges();
    this.factureForm.setControl("prestationIds", this.fb.array([])); // Ensure array is set
    console.log(this.prestationIds.value);
    // Update preview whenever form changes
    this.factureForm.valueChanges.subscribe(() => {
      this.updateFacturePreview();
    });
  }

  loadFactureData(): void {
    this.factureClientService.getFacturePreview(this.factureClientId).subscribe({
      next: (factureClientData) => {
        // Patch the form with the loaded facture data (excluding the FormArray)
        this.factureForm.patchValue({
          factureClientId: factureClientData.factureClientId,
          consultantId: factureClientData.consultantId,
          contratId: factureClientData.contratClientId,
          refFacture: factureClientData.refFacture,
          dateEmmission: factureClientData.dateEmmission,
          dateEcheance: factureClientData.dateEcheance,
          pourcentageTva: factureClientData.pourcentageTva,
          pourcentageRemise: factureClientData.pourcentageRemise,
          objet: factureClientData.objet,
          numBonCommande: factureClientData.numBonCommande,
          typePaiement: factureClientData.typePaiement,
        });
  
        // Clear the FormArray before adding new controls
        while (this.prestationIds.length !== 0) {
          this.prestationIds.removeAt(0);
        }
        this.prestationIds.clear();
        // Populate the FormArray for prestations if not empty
        if (factureClientData.prestations && factureClientData.prestations.length) {
          factureClientData.prestations.forEach((p: any) => {
            this.prestationIds.push(this.fb.control(p.prestationId, Validators.required));
          });
        }
        console.log("Prestation ids loaded into the select:", this.prestationIds.value);
  
        // Set the selected contrat based on the loaded contratClientId
        this.selectedContrat = this.contratsClient.find(
          (c: any) => c.contratClientId === factureClientData.contratClientId
        );
  
        this.updateFacturePreview();
      },
      error: (error) => {
        console.error("Error loading facture data:", error);
      },
    });
  }
  getAvailablePrestationsFor(index: number): any[] {
    // Get selected IDs from all rows except the current one
    const selectedIds = this.prestationIds.controls
      .filter((ctrl, i) => i !== index)
      .map(ctrl => ctrl.value)
      .filter(val => val !== null);
      
    // Get current row's value so we can always include it even if it appears in selectedIds
    const currentValue = this.prestationIds.at(index).value;
    
    // Filter the master list
    return this.prestations.filter(p => {
      return !selectedIds.includes(p.prestationId) || p.prestationId === currentValue;
    });
  }
  

  addPrestation(): void {
    this.prestationIds.push(this.fb.control(null, Validators.required));
    this.updateAvailablePrestations();
    //setTimeout(() => this.updateFacturePreview(), 0);
    this.cdr.detectChanges(); // Ensure UI updates properly

  }
  isPrestationSelectedElsewhere(currentIndex: number, prestationId: number): boolean {
    return this.prestationIds.controls.some((ctrl, idx) => {
      return idx !== currentIndex && ctrl.value === prestationId;
    });
  }
  
  removePrestation(index: number): void {
    this.prestationIds.removeAt(index);
    this.updateAvailablePrestations();
    this.updateFacturePreview();
  }

  updateAvailablePrestations(): void {
    const selectedIds = this.prestationIds.value.filter((id: number) => id !== null);
    
    // Keep selected prestations in the list for proper UI binding
    this.availablePrestations = this.prestations.map((p) => ({
      ...p,
      disabled: selectedIds.includes(p.prestationId), // Mark already selected ones as disabled
    }));
  }

  onPrestationSelected(index: number): void {
    this.prestations = [...this.prestations];
    this.updateAvailablePrestations();
    this.prestationIds.setValue([...this.prestationIds.value]);
    
    setTimeout(() => this.updateFacturePreview(), 0);
  }

  getSelectedPrestation(index: number): any {
    const prestationId = this.prestationIds.at(index).value;
    if (!prestationId) return null;

    const id = typeof prestationId === "string" ? parseInt(prestationId, 10) : prestationId;
    const prestation = this.prestations.find((p) => p.prestationId === id) || null;

    return prestation ? { ...prestation, quantite: prestation.quantite ?? 1 } : null;
  }

  onContratSelected(): void {
    const contratId = Number(this.factureForm.get("contratId")?.value);

    if (contratId) {
      this.selectedContrat = this.contratsClient.find(
        (c) => c.contratClientId === contratId
      );

      if (this.selectedContrat?.client?.pays?.nomFrFr?.toLowerCase() === "tunisie") {
        this.factureForm.patchValue({ pourcentageTva: 19 });
      } else {
        this.factureForm.patchValue({ pourcentageTva: 20 });
      }

      if (this.selectedContrat) {
        const currentDate = new Date();
        const monthNames = [
          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
        ];
        const monthName = monthNames[currentDate.getMonth()];

        this.factureForm.patchValue({
          objet: `Facture ${monthName}`,
        });

        this.updateFacturePreview();
      }
    }
  }

  trackByPrestationId(index: number, prestation: any): number {
    return prestation.prestationId;
  }

  updateFacturePreview(): void {
    if (!this.selectedContrat) return;
    const formValues = this.factureForm.value;
    const selectedPrestationIds = this.prestationIds.controls
      .map((control) => control.value)
      .filter((id) => !!id)
      .map((id) => Number(id));

    if (selectedPrestationIds.length === 0) {
      this.facturePreview = null;
      return;
    }

    const selectedPrestations = this.prestations.filter((p) =>
      selectedPrestationIds.includes(p.prestationId)
    );
    console.log(selectedPrestations);
    console.log(selectedPrestationIds);

    const montantHtBrut = selectedPrestations.reduce(
      (sum, p) => sum + p.prixUnitaire * p.quantite,
      0
    );
    const pourcentageRemise = formValues.pourcentageRemise || 0;
    const montantRemise = montantHtBrut * (pourcentageRemise / 100);
    const montantHt = montantHtBrut - montantRemise;

    const pourcentageTva = formValues.pourcentageTva;
    const montantTva = montantHt * (pourcentageTva / 100);
    const montantTtc = montantHt + montantTva;

    const prestationsData = selectedPrestations.map((p: any) => ({
      id: p.prestationId,
      description: p.description,
      quantite: p.quantite,
      prixUnitaire: p.prixUnitaire,
      montantHt: p.prixUnitaire * p.quantite,
    }));

    this.facturePreview = {
      refFacture: formValues.refFacture,
      dateEmmission: formValues.dateEmmission,
      dateEcheance: formValues.dateEcheance,
      clientNom: this.selectedContrat.client.nom,
      clientAdresse: this.selectedContrat.client.adresse,
      clientNumeroSiret: this.selectedContrat.client.numeroSiret,
      pourcentageTva: pourcentageTva,
      pourcentageRemise: pourcentageRemise,
      objet: formValues.objet,
      numBonCommande: formValues.numBonCommande,
      prestations: prestationsData,
      montantHtBrut: montantHtBrut,
      montantRemise: montantRemise,
      montantHt: montantHt,
      montantTva: montantTva,
      montantTtc: montantTtc,
    };
    console.log(this.facturePreview);
  }

  clearForm(): void {
    this.factureForm.reset({
      contratId: null,
      refFacture: "",
      dateEmmission: new Date(),
      dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)),
      pourcentageTva: 20,
      pourcentageRemise: 0,
      objet: "",
      numBonCommande: "",
      typePaiement: "VIREMENT",
      prestationIds: this.fb.array([]),
    });

    this.selectedContrat = null;
    this.facturePreview = null;
  }

  saveFacture(): void {
    const factureData = {
      factureClientId: this.factureForm.value.factureClientId,
      prestationIds: this.factureForm.value.prestationIds.filter(
        (id: number) => id !== null
      ),
      consultantId: 1, // Static value for consultantId
      contratId: this.factureForm.value.contratId,
      dateEcheance: this.factureForm.value.dateEcheance,
      typePaiement: this.factureForm.value.typePaiement,
      pourcentageRemise: this.factureForm.value.pourcentageRemise || 0,
      objet: this.factureForm.value.objet,
      numBonCommande: this.factureForm.value.numBonCommande,
    };

    console.log(factureData);
    this.isLoading = true;

    this.factureClientService.updateFactureClient(factureData.factureClientId, factureData).subscribe({
      next: () => {
        this.isLoading = false;
        this.factureUpdated.emit(factureData);

        Swal.fire({
          icon: "success",
          title: "Facture mise à jour avec succès!",
          showConfirmButton: true,
        });

        this.modalRef.hide();

        window.open(`/facture/client/details/${factureData.factureClientId}`, "_blank");
      },
      error: (error) => {
        console.error("Error updating facture:", error);
        this.isLoading = false;

        Swal.fire({
          icon: "error",
          title: "Erreur lors de la mise à jour de la facture",
          text: error.message,
        });
      },
    });
  }
}
