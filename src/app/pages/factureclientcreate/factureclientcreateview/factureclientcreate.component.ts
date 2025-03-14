import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { FactureClientService } from "../../../core/services/factureclient.service";
import { Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-factureclientcreate",
  templateUrl: "./factureclientcreate.component.html",
})
export class FactureClientCreateComponent implements OnInit {
  factureForm: FormGroup;
  prestations: any[] = [];
  availablePrestations: any[] = [];
  contratsClient: any[] = [];
  selectedContrat: any = null;
  facturePreview: any = null;
  bsConfig: Partial<BsDatepickerConfig>;
  isLoading = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private factureClientService: FactureClientService,
    private router: Router
  ) {
    this.bsConfig = {
      dateInputFormat: "DD/MM/YYYY",
      containerClass: "theme-default",
    };

    this.factureForm = this.fb.group({
        contratId: [null, Validators.required],
        refFacture: ["", Validators.required],
        dateEmmission: [new Date(), Validators.required],
        dateEcheance: [
          new Date(new Date().setDate(new Date().getDate() + 30)),
          Validators.required,
        ],
        pourcentageTva: [20, Validators.required],
        pourcentageRemise: [0],
        objet: ["", Validators.required],  // New form field for "objet"
        numBonCommande: [""],  // New form field for "numBonCommande"
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
      },
      error: (error) => {
        console.error("Error fetching data:", error);
        this.isLoading = false;
      },
    });

    // Update preview whenever form changes
    this.factureForm.valueChanges.subscribe(() => {
      this.updateFacturePreview();
    });
  }

  addPrestation(): void {
    this.prestationIds.push(this.fb.control(null, Validators.required));
    this.updateAvailablePrestations(); 
    setTimeout(() => this.updateFacturePreview(), 0); // Ensure update happens after UI update
  }

  removePrestation(index: number): void {
    this.prestationIds.removeAt(index);
    this.updateAvailablePrestations();
    this.updateFacturePreview();
  }

  updateAvailablePrestations(): void {
    const selectedIds = this.prestationIds.value.filter((id: number) => id !== null);
    this.availablePrestations = this.prestations.filter(
      (prestation) => !selectedIds.includes(prestation.prestationId)
    );
  }

  onPrestationSelected(index: number): void {
    // Force change detection by triggering a UI update
    this.prestations = [...this.prestations];
    this.updateAvailablePrestations(); // Add this line
    setTimeout(() => this.updateFacturePreview(), 0); // Trigger update after UI update
}

getSelectedPrestation(index: number): any {
    const prestationId = this.prestationIds.at(index).value;
    if (!prestationId) return null;
  
    const id = typeof prestationId === "string" ? parseInt(prestationId, 10) : prestationId;
    const prestation = this.prestations.find((p) => p.prestationId === id) || null;
  
    return prestation ? { ...prestation, quantite: prestation.quantite ?? 1 } : null; // Ensure quantite is at least 1
  }

  onContratSelected(): void {
    const contratId = Number(this.factureForm.get("contratId")?.value);

    if (contratId) {
      this.selectedContrat = this.contratsClient.find(
        (c) => c.contratClientId === contratId
      );

      if (
        this.selectedContrat?.client?.pays?.nomFrFr?.toLowerCase() === "tunisie"
      ) {
        this.factureForm.patchValue({ pourcentageTva: 19 });
      } else {
        this.factureForm.patchValue({ pourcentageTva: 20 });
      }

      if (this.selectedContrat) {
        const currentDate = new Date();
        const monthNames = [
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
    .map(control => control.value)
    .filter(id => !!id)
    .map(id => Number(id)); // <-- Add this conversion

  if (selectedPrestationIds.length === 0) {
    this.facturePreview = null;
    return;
  }

  // Now filter using numeric IDs
  const selectedPrestations = this.prestations.filter(p => 
    selectedPrestationIds.includes(p.prestationId)
  );
  console.log(selectedPrestations);
  console.log(selectedPrestationIds);

    // Calculation logic remains the same
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

  saveFacture(): void {
    //TODO check how to fix the form being valid.
    /*if (this.factureForm.invalid) {
      Object.keys(this.factureForm.controls).forEach((key) => {
        const control = this.factureForm.get(key);
        control?.markAsTouched();
      });
      return;
    }*/
  
    const factureData = {
      prestationIds: this.factureForm.value.prestationIds.filter(
        (id: number) => id !== null
      ),
      consultantId: 1,  // Static value for consultantId
      contratId: this.factureForm.value.contratId,
      dateEcheance: this.factureForm.value.dateEcheance,
      typePaiement: this.factureForm.value.typePaiement,
      pourcentageRemise: this.factureForm.value.pourcentageRemise || 0,
      objet: this.factureForm.value.objet,  // Include "objet"
      numBonCommande: this.factureForm.value.numBonCommande,  // Include "numBonCommande"
    };
    console.log(factureData);
    this.isLoading = true;
  
    this.factureClientService.createFactureClient(factureData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate([
          "/facture/client/details",
          response.factureClientId,
        ]);
      },
      error: (error) => {
        console.error("Error creating invoice:", error);
        this.isLoading = false;
      },
    });
  }
  
}
