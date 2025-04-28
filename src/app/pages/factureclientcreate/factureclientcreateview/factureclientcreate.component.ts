import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { FactureClientService } from "../../../core/services/factureclient.service";
import { Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { forkJoin } from "rxjs";
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Store } from "@ngrx/store";
import { selectFactureSelected } from "src/app/store/FactureClient/factureclient.selector";
import * as FactureClientActions from '../../../store/FactureClient/factureclient.actions';
import { loadPrestations } from "src/app/store/Prestation/prestation.action";
import { loadContratsClient } from "src/app/store/contratClient/contratClient.actions";
import { selectAllPrestations } from "src/app/store/Prestation/prestation-selector";
import { selectAllContratsClient } from "src/app/store/contratClient/contratClient-selector";

@Component({
  selector: "app-factureclientcreate",
  templateUrl: "./factureclientcreate.component.html",
})
export class FactureClientCreateComponent implements OnInit {
  submitted = false;
  factureForm: FormGroup;
  prestations: any[] = [];
  availablePrestations: any[] = [];
  contratsClient: any[] = [];
  selectedContrat: any = null;
  facturePreview: any = null;
  bsConfig: Partial<BsDatepickerConfig>;
  isLoading = false;
  today = new Date();
  isEditMode: boolean = false;

  @Output() factureCreated = new EventEmitter<any>();
  @Input() factureClientId!: number;

  constructor(private fb: FormBuilder, private store: Store, public modalRef: BsModalRef) {
    this.bsConfig = {
      dateInputFormat: "DD/MM/YYYY",
      containerClass: "theme-default",
    };
    this.initForm();
  }

  get prestationIds(): FormArray {
    return this.factureForm.get("prestationIds") as FormArray;
  }

  ngOnInit(): void {
    this.isEditMode = !!this.factureClientId;
    this.store.dispatch(loadPrestations());
    this.store.dispatch(loadContratsClient());

    let loadedFacture: any = null;

    this.store.select(selectAllContratsClient).subscribe((contrats) => this.contratsClient = contrats);
    this.store.select(selectAllPrestations).subscribe((prestations) => {
      this.prestations = prestations;
      this.availablePrestations = [...prestations];
      if (this.isEditMode && loadedFacture) this.patchFactureForm(loadedFacture);
    });

    if (this.isEditMode) {
      this.store.dispatch(FactureClientActions.loadFactureClientById({ id: this.factureClientId }));
      this.store.select(selectFactureSelected).subscribe((facture) => {
        if (facture) {
          loadedFacture = facture;
          if (this.prestations.length > 0) this.patchFactureForm(facture);
        }
      });
    }

    this.factureForm.valueChanges.subscribe(() => this.updateFacturePreview());
  }

  initForm() {
    this.factureForm = this.fb.group({
      contratId: [null, Validators.required],
      refFacture: ["", Validators.required],
      dateEmmission: [new Date(), Validators.required],
      dateEcheance: [new Date(new Date().setDate(new Date().getDate() + 30)), Validators.required],
      pourcentageTva: [20, Validators.required],
      pourcentageRemise: [0],
      objet: ["", Validators.required],
      numBonCommande: ["", Validators.pattern("^[a-zA-Z0-9-_/]+$")],
      typePaiement: ["VIREMENT", Validators.required],
      prestationIds: this.fb.array([]),
    });
  }

  patchFactureForm(facture: any): void {
    this.selectedContrat = this.contratsClient.find(c => c.contratClientId === facture.contratId);
    this.factureForm.patchValue({
      contratId: facture.contratId,
      refFacture: facture.refFacture,
      dateEmmission: facture.dateEmmission,
      dateEcheance: facture.dateEcheance,
      pourcentageTva: facture.pourcentageTva,
      pourcentageRemise: facture.pourcentageRemise,
      objet: facture.objet,
      numBonCommande: facture.numBonCommande,
      typePaiement: facture.typePaiement,
    });
    this.prestationIds.clear();
    facture.prestations?.forEach((p: any) => {
      const fullPrestation = this.prestations.find(pr => pr.prestationId === p.prestationId);
      const merged = { ...fullPrestation, ...p };
      this.prestationIds.push(this.fb.control(merged, Validators.required));
    });
    this.updateAvailablePrestations();
    this.updateFacturePreview();
  }

  addPrestation(): void {
    this.prestationIds.push(this.fb.control(null, Validators.required));
    this.updateAvailablePrestations();
    setTimeout(() => this.updateFacturePreview(), 0);
  }

  removePrestation(index: number): void {
    this.prestationIds.removeAt(index);
    this.updateAvailablePrestations();
    this.updateFacturePreview();
  }

  updateAvailablePrestations(): void {
    const selectedIds = this.prestationIds.value.filter((id: number) => id !== null);
    this.availablePrestations = this.prestations.filter(p => !selectedIds.includes(p.prestationId));
  }

  onContratSelected(): void {
    const contratId = Number(this.factureForm.get("contratId")?.value);
    if (contratId) {
      this.selectedContrat = this.contratsClient.find(c => c.contratClientId === contratId);
      const isTunisie = this.selectedContrat?.client?.pays?.nomFrFr?.toLowerCase() === "tunisie";
      this.factureForm.patchValue({
        pourcentageTva: isTunisie ? 19 : 20,
        objet: `Facture ${new Date().toLocaleString('fr-FR', { month: 'long' })}`
      });
      this.updateFacturePreview();
    }
  }
  updateFacturePreview(): void {
    if (!this.selectedContrat) return;
    const formValues = this.factureForm.value;
    const selectedPrestations = this.prestationIds.controls.map(c => c.value).filter(p => !!p);

    if (selectedPrestations.length === 0) {
      this.facturePreview = null;
      return;
    }

    const montantHtBrut = selectedPrestations.reduce((sum, p) => sum + (p.prixUnitaire || 0) * (p.quantite || 0), 0);
    const montantRemise = montantHtBrut * ((formValues.pourcentageRemise || 0) / 100);
    const montantHt = montantHtBrut - montantRemise;
    const montantTva = montantHt * (formValues.pourcentageTva / 100);
    const montantTtc = montantHt + montantTva;

    this.facturePreview = {
      refFacture: formValues.refFacture,
      dateEmmission: formValues.dateEmmission,
      dateEcheance: formValues.dateEcheance,
      clientNom: this.selectedContrat.client.nom,
      clientAdresse: this.selectedContrat.client.adresse,
      clientNumeroSiret: this.selectedContrat.client.numeroSiret,
      pourcentageTva: formValues.pourcentageTva,
      pourcentageRemise: formValues.pourcentageRemise,
      objet: formValues.objet,
      numBonCommande: formValues.numBonCommande,
      prestations: selectedPrestations.map(p => ({
        id: p.prestationId,
        description: p.description,
        quantite: p.quantite,
        prixUnitaire: p.prixUnitaire,
        montantHt: (p.prixUnitaire || 0) * (p.quantite || 0)
      })),
      montantHtBrut,
      montantRemise,
      montantHt,
      montantTva,
      montantTtc
    };
  }
  getSelectedPrestation(index: number): any {
    const prestation = this.prestationIds.at(index).value;
    return prestation ? { ...prestation, quantite: prestation.quantite ?? 1, description: prestation.description ?? '' } : null;
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
    const factureData: any = {
      factureClientId: this.factureClientId,
      prestations: this.factureForm.value.prestationIds.filter((p: any) => p !== null),
      consultantId: 1,
      contratId: this.factureForm.value.contratId,
      dateEcheance: this.factureForm.value.dateEcheance,
      typePaiement: this.factureForm.value.typePaiement,
      pourcentageRemise: this.factureForm.value.pourcentageRemise || 0,
      objet: this.factureForm.value.objet,
      numBonCommande: this.factureForm.value.numBonCommande,
    };
  
    this.submitted = true;
    this.isLoading = true;
  
    if (this.isEditMode) {
      this.store.select(selectFactureSelected).subscribe((facture) => {
        if (facture && this.submitted) {
          factureData.statutFacture = facture.statutFacture;
          factureData.statutPaiement = facture.statutPaiement;
  
          this.store.dispatch(FactureClientActions.updateFactureClient({ facture: factureData }));
  
          Swal.fire({
            icon: 'success',
            title: 'Facture modifiée !',
            text: 'La facture a été mise à jour avec succès.',
            timer: 1000,
            showConfirmButton: false,
          }).then(() => {
            this.factureCreated.emit();
            this.modalRef.hide();
          });
  
          this.submitted = false; 
        }
      });
    } else {
      factureData.statutFacture = 'En_Attente';
      factureData.statutPaiement = 'NON_PAYÉE';
  
      this.store.dispatch(FactureClientActions.createFactureClient({ facture: factureData }));
      this.store.dispatch(FactureClientActions.loadFacturesClient());
      Swal.fire({
        icon: 'success',
        title: 'Facture enregistrée !',
        text: 'La facture a été enregistrée avec succès.',
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        this.factureCreated.emit();
        this.modalRef.hide();
      });
    }
  } 
  getTruncatedDescription = (prestation: any) => {
    if (!prestation?.description) {
      return '';
    }
    const words = prestation.description.split(' ');
    return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
  };    
  
}