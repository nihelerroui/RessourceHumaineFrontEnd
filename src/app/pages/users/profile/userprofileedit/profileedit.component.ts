import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { filter, take } from "rxjs";
import { selectCreatedPersonalDetails } from "src/app/store/Authentication/authentication-selector";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";

@Component({
  selector: "app-profile-edit",
  templateUrl: "./profileedit.component.html",
  styleUrls: ["./profileedit.component.scss"],
})
export class ProfileEditComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  userForm: FormGroup;

  personalDetailsForm: FormGroup;

  cniFile: File;
  ribFile: File;
  carteGriseFile: File;
  kbisFile: File;
  navigoFile: File;
  contratFile: File;
  attestationsFiles: File[] = [];

  currentUser: any;
  loading = false;
  submitted = false;
  currentStep = 1;
  totalSteps = 5;

  cniPath: string;
  ribPath: string;
  carteGrisePath: string;
  kbisPath: string;
  navigoPath: string;
  contratPath: string;
  attestationsPath: string;

  urssafFile: File;
  photoFile: File;
  urssafPath: string;
  photoPath: string;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Gestion de compte", path: "/" },
      { label: "Modifier Profile", active: true },
    ];

    const data = localStorage.getItem("currentUser");
    if (!data) {
      this.router.navigate(["/login"]);
      return;
    }

    this.currentUser = JSON.parse(data);
    this.initForms();
  }

  initForms(): void {
    const c = this.currentUser;
    const p = c.personalDetails || {};

    this.cniPath = p.cni || "";
    this.ribPath = p.rib || "";
    this.carteGrisePath = p.carteGrise || "";
    this.kbisPath = p.kbis || "";
    this.navigoPath = p.navigo || "";
    this.contratPath = p.contart || "";
    this.attestationsPath = p.attestations || "";
    this.urssafPath = p.urssaf || "";
    this.photoPath = p.photo || "";

    this.userForm = this.fb.group({
      email: [c.user?.email, [Validators.required, Validators.email]],
      fullName: [c.fullName, Validators.required],
      name: [c.name, Validators.required],
      prenom: [c.prenom, Validators.required],
      telephone: [c.telephone, [Validators.required]],
    });

    this.personalDetailsForm = this.fb.group({
      numRue: [p.numRue],
      nomRue: [p.nomRue],
      complementAdr: [p.complementAdr],
      codePostal: [p.codePostal],
      ville: [p.ville],
      iban: [p.iban],
      bic: [p.bic],
      nummss: [p.nummss],
      dateDebCni: [p.dateDebCni],
      dateFinCni: [p.dateFinCni],
      bisTer: [p.bisTer],
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  submit(): void {
    this.submitted = true;
    if (this.userForm.invalid) return;

    const userId = this.currentUser.user.userId;
    const consultantId = this.currentUser.consultantId;
    const personalDetailsId =
      this.currentUser.personalDetails?.personalDetailsId;

    const email = this.userForm.value.email;

    const consultantData = {
      name: this.userForm.value.name,
      prenom: this.userForm.value.prenom,
      fullName: this.userForm.value.fullName,
      telephone: this.userForm.value.telephone,
      commercial: this.userForm.value.commercial,
      dateSortie: this.userForm.value.dateSortie,
    };

    const personalData = this.personalDetailsForm.value;

    this.loading = true;

    this.store.dispatch(AuthActions.updateUser({ userId, request: { email } }));
    this.store.dispatch(
      AuthActions.updateConsultant({ consultantId, request: consultantData })
    );
    this.store.dispatch(
      AuthActions.updatePersonalDetailsWithFiles({
        personalDetailsId,
        dto: personalData,
        files: {
          cniFile: this.cniFile,
          ribFile: this.ribFile,
          carteGriseFile: this.carteGriseFile,
          kbisFile: this.kbisFile,
          navigoFile: this.navigoFile,
          contratFile: this.contratFile,
          attestationsFiles: this.attestationsFiles,
          urssafFile: this.urssafFile,
          photoFile: this.photoFile,
        },
      })
    );

    this.store
      .select(selectCreatedPersonalDetails)
      .pipe(
        filter((details) => !!details),
        take(1)
      )
      .subscribe((updatedDetails) => {
        const updatedUser = {
          ...this.currentUser,
          user: {
            ...this.currentUser.user,
            email,
          },
          ...consultantData,
          personalDetails: updatedDetails,
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        this.loading = false;
        this.router.navigate(["/profile"]);
      });
  }

  get userF() {
    return this.userForm.controls;
  }

  get personalF() {
    return this.personalDetailsForm.controls;
  }

  onFileChange(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    if (field === "attestationsFiles") {
      this.attestationsFiles = Array.from(target.files);
    } else {
      this[field] = target.files[0];
    }
  }

  hasExistingFile(field: string): boolean {
    return !!this.currentUser?.personalDetails?.[field];
  }

  extractFileName(path: string): string {
    return path?.split("/").pop() || "";
  }

  getFileByField(field: string): File | undefined {
    return (this as any)[field];
  }
}
