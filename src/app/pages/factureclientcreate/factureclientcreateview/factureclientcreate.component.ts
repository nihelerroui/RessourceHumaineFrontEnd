import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Store } from "@ngrx/store";
import { selectFactureSelected, selectPrestationsByClient } from "src/app/store/FactureClient/factureclient.selector";
import * as FactureClientActions from '../../../store/FactureClient/factureclient.actions';
import { loadPrestations } from "src/app/store/Prestation/prestation.action";
import { loadContratsClient } from "src/app/store/contratClient/contratClient.actions";
import { selectAllPrestations } from "src/app/store/Prestation/prestation-selector";
import { selectAllContratsClient } from "src/app/store/contratClient/contratClient-selector";
import { Actions, ofType } from "@ngrx/effects";

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
  today = new Date();
  isEditMode: boolean = false;

  @Output() factureCreated = new EventEmitter<any>();
  @Input() factureClientId!: number;

  constructor(private fb: FormBuilder, private store: Store, public modalRef: BsModalRef, private actions$: Actions) {
    this.initForm();
  }

  get prestationIds(): FormArray {
    return this.factureForm.get("prestationIds") as FormArray;
  }

  ngOnInit(): void {
    this.isEditMode = !!this.factureClientId;

    this.store.dispatch(loadContratsClient());

    // Récupération des contrats
    this.store.select(selectAllContratsClient).subscribe((contrats) => {
      this.contratsClient = contrats;
    });

    // Récupération des prestations
    this.store.select(selectPrestationsByClient).subscribe((prestations) => {
      this.prestations = prestations;
      this.updateAvailablePrestations();
    });

    // Écoute de l'effet pour mettre à jour les jours travaillés
    this.actions$.pipe(ofType(FactureClientActions.getWorkingDaysSuccess)).subscribe(({ workingDays, index }) => {
      const prestation = this.prestationIds.at(index).value;
      const updated = {
        ...prestation,
        quantite: workingDays,
        montantHt: (prestation.prixUnitaire || 0) * workingDays,
      };
      this.prestationIds.at(index).setValue(updated);
      this.updateFacturePreview();
    });

    // Chargement et application de la facture en mode édition
    if (this.isEditMode) {
      this.store.dispatch(FactureClientActions.loadFactureClientById({ id: this.factureClientId }));
      this.store.select(selectFactureSelected).subscribe((facture) => {
        if (facture && this.prestations.length > 0) {
          this.patchFactureForm(facture);
        }
      });
    }

    // Mise à jour de la preview en fonction des changements de formulaire
    this.factureForm.valueChanges.subscribe(() => this.updateFacturePreview());
  }

  initForm() {
    this.factureForm = this.fb.group({
      contratId: [null, Validators.required],
      dateEmmission: [new Date(), Validators.required],
      dateEcheance: [new Date(), Validators.required],
      pourcentageTva: [0],
      pourcentageRemise: [0],
      objet: ["", Validators.required],
      numBonCommande: ["", Validators.pattern("^[a-zA-Z0-9-_/]+$")],
      typePaiement: ["", Validators.required],
      prestationIds: this.fb.array([]),
    });
  }

  patchFactureForm(facture: any): void {
    this.selectedContrat = this.contratsClient.find(c => c.contratClientId === facture.contratId);

    this.factureForm.patchValue({
      contratId: facture.contratId,
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
      // Chercher la prestation complète avec le même ID
      let fullPrestation = this.prestations.find(pr => pr.prestationId === p.prestationId);

      // Vérifier si la prestation complète existe et contient un titre
      if (fullPrestation) {
        fullPrestation = {
          ...fullPrestation,
          prestationId: p.prestationId,
          titre: fullPrestation.titre || p.titre || "Prestation sans titre",
          quantite: p.quantite || 1,
          prixUnitaire: p.prixUnitaire || 0
        };
      } else {
        // Si non trouvé, créer un objet minimal
        fullPrestation = {
          prestationId: p.prestationId,
          titre: p.titre || "Prestation sans titre",
          quantite: p.quantite || 1,
          prixUnitaire: p.prixUnitaire || 0
        };
      }

      // Ajouter la prestation corrigée au formulaire
      this.prestationIds.push(this.fb.control(fullPrestation, Validators.required));
    });

    this.updateAvailablePrestations();
    this.updateFacturePreview();
  }


  addPrestation(): void {
    this.prestationIds.push(this.fb.control(null, Validators.required));
    this.updateAvailablePrestations();
    this.updateFacturePreview();
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

      if (this.selectedContrat?.client?.clientId) {
        const clientId = this.selectedContrat.client.clientId;
        this.store.dispatch(FactureClientActions.loadPrestationsByClient({ clientId }));
      }

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
      dateEmmission: new Date(),
      dateEcheance: new Date(),
      pourcentageTva: 0,
      pourcentageRemise: 0,
      objet: "",
      numBonCommande: "",
      typePaiement: "",
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
  onPrestationSelected(index: number): void {
    const prestation = this.prestationIds.at(index).value;
    const full = this.prestations.find(p => p.prestationId === prestation?.prestationId);

    if (!full) return;

    const { consultantId, month, year } = full;

    if (consultantId && month && year) {
      this.store.dispatch(FactureClientActions.getWorkingDays({ consultant_id: consultantId, month, year, index }));
    }

    this.prestationIds.at(index).setValue(full);
  }
}