import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { User } from "src/app/models/auth.models";
import { Store } from "@ngrx/store";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import { Actions, ofType } from "@ngrx/effects";
import Swal from "sweetalert2";
import { UserRole } from "src/app/models/userRole.enum";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Consultant } from "src/app/models/consultant.models";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";
@Component({
  selector: "app-utilisateurregisterview",
  templateUrl: "./utilisateurregisterview.component.html",
  styleUrls: ["./utilisateurregisterview.component.scss"],
})
export class UtilisateurregisterviewComponent implements OnInit {
  @Input() mode: "add" | "edit" = "add";
  @Input() consultant: Consultant | null = null;
  societes: any[] = [];
  currentStep = 1;
  totalSteps = 2;
  userForm: FormGroup;
  consultantForm: FormGroup;
  personalDetailsForm: FormGroup;
  roles = Object.values(UserRole);
  passwordStrength = 0;
  isSubmitting = false;

  userIdCreated: number | null = null;
  personalDetailsIdCreated: number | null = null;

  cniFile: File | null = null;
  carteGriseFile: File | null = null;
  navigoFile: File | null = null;
  attestationsFiles: File[] = [];
  contratFile: File | null = null;
  kbisFile: File | null = null;
  urssafFile: File | null = null;
  photoFile: File | null = null;
  ribFile: File | null = null;

  roleDescriptions = {
    [UserRole.ADMINISTRATEUR]:
      "Accès complet au système avec tous les privilèges administratifs",
    [UserRole.RESPONSABLE_FINANCIER]:
      "Gestion des aspects financiers et comptables",
    [UserRole.SOUS_TRAITANT]:
      "Accès limité aux fonctionnalités spécifiques aux sous-traitants",
  };

  roleIcons = {
    [UserRole.ADMINISTRATEUR]: "fa-user-shield",
    [UserRole.RESPONSABLE_FINANCIER]: "fa-chart-line",
    [UserRole.SOUS_TRAITANT]: "fa-user-cog",
  };

  constructor(
    public bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions ,
    private auth : AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initForms();

    this.store.dispatch(AuthActions.loadAdminSocietes());
    this.store.select(selectAllSocietes).subscribe((societes) => {
      this.societes = societes;
    });

    if (this.mode === "edit" && this.consultant) {
      this.totalSteps = 3;
      this.patchFormWithUser(this.consultant.user);
      this.patchFormWithConsultant(this.consultant);
      this.personalDetailsForm.patchValue(this.consultant.personalDetails);
      this.userIdCreated = this.consultant.user.userId;
      this.personalDetailsIdCreated =
        this.consultant.personalDetails?.personalDetailsId;
    }

    this.actions$
      .pipe(ofType(AuthActions.createConsultantSuccess))
      .subscribe(() => {
        Swal.fire({
          icon: "success",
          title: "Consultant ajouté avec succès",
        });
        this.store.dispatch(AuthActions.loadConsultants());
        this.bsModalRef.hide();
      });

    this.actions$
      .pipe(ofType(AuthActions.updateConsultantSuccess))
      .subscribe(() => {
        Swal.fire({
          icon: "success",
          title: "Consultant modifé avec succès",
        });
        this.store.dispatch(AuthActions.loadConsultants());
        this.bsModalRef.hide();
      });
  }

  initForms(): void {
    this.userForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", Validators.required],
        role: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.consultantForm = this.fb.group({
      fullName: ["", Validators.required],
      name: ["", Validators.required],
      prenom: ["", Validators.required],
      telephone: ["", Validators.required],
      typeLibelle: ["", Validators.required],
      dateRecrutement: ["", Validators.required],
      dateSortie: [""],
      fonction: ["", Validators.required],
      matricule: ["", Validators.required],
      commercial: [false],
      societeId: ["", Validators.required],
    });

    this.userForm.get("password").valueChanges.subscribe((password) => {
      this.calculatePasswordStrength(password);
    });

    this.personalDetailsForm = this.fb.group({
      bic: [""],
      iban: [""],
      ville: [""],
      codePostal: [""],
      numRue: [""],
      nomRue: [""],
      complementAdr: [""],
      bisTer: [""],
      nummss: [""],
      urssaf: [""],
      cni: [""],
      rib: [""],
      dateDebCni: [""],
      dateFinCni: [""],
      kbis: [""],
      navigo: [""],
      carteGrise: [""],
      contart: [""],
      attestations: [""],
    });
  }

  patchFormWithUser(user: User): void {
    this.userForm.patchValue({
      email: user.email,
      password: "********",
      confirmPassword: "********",
      role: user.role,
    });
  }

  patchFormWithConsultant(consultant: Consultant): void {
    this.consultantForm.patchValue({
      fullName: consultant.fullName,
      name: consultant.name,
      prenom: consultant.prenom,
      telephone: consultant.telephone,
      typeLibelle: consultant.typeLibelle,
      dateRecrutement: consultant.dateRecrutement,
      dateSortie: consultant.dateSortie,
      fonction: consultant.fonction,
      matricule: consultant.matricule,
      commercial: consultant.isCommercial,
      societeId: consultant.societe?.societeId,
    });
  }

  formatRoleName(role: string): string {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;

    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    this.passwordStrength = Math.min(100, strength);
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength < 40) return "danger";
    if (this.passwordStrength < 70) return "warning";
    return "success";
  }

  getPasswordStrengthText(): string {
    if (this.passwordStrength < 40) return "Faible";
    if (this.passwordStrength < 70) return "Moyen";
    return "Fort";
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.userForm.valid) {
      const userRequest = {
        ...this.userForm.value,
        enabled: true,
      };

      if (this.mode === "edit" && this.consultant) {
        const userId = this.consultant.user.userId;
        this.store.dispatch(
          AuthActions.updateUser({ userId, request: userRequest })
        );
        this.currentStep++;
      } else {
        this.store.dispatch(AuthActions.createUser({ request: userRequest }));

        this.actions$
          .pipe(ofType(AuthActions.createUserSuccess))
          .subscribe(({ user }) => {
            this.userIdCreated = user.userId;

            this.store.dispatch(
              AuthActions.createPersonalDetails({ request: {} })
            );

            this.actions$
              .pipe(ofType(AuthActions.createPersonalDetailsSuccess))
              .subscribe(({ personalDetails }) => {
                this.personalDetailsIdCreated =
                  personalDetails.personalDetailsId;
                this.currentStep++;
              });
          });
      }
    }

    else if (this.currentStep === 2 && this.consultantForm.valid) {
      if (this.mode === "edit") {
        this.currentStep = 3;
      } else {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm(): void {
  if (this.consultantForm.invalid || !this.userIdCreated) return;

  const userRequest = {
    ...this.userForm.value,
    enabled: true,
  };

  if (this.mode === 'edit') {
    delete userRequest.password;
    delete userRequest.confirmPassword;
  }

  const consultantRequest = {
    ...this.consultantForm.value,
    userId: this.userIdCreated,
    personalDetailsId: this.personalDetailsIdCreated,
    societeId: this.consultantForm.value.societeId,
    dateSortie: this.consultantForm.value.dateSortie || null
  };

  if (this.mode === 'edit') {
    this.store.dispatch(
      AuthActions.updateUser({
        userId: this.consultant.user.userId,
        request: userRequest,
      })
    );
    this.store.dispatch(
      AuthActions.updateConsultant({
        consultantId: this.consultant.consultantId,
        request: consultantRequest,
      })
    );

    this.store.dispatch(
      AuthActions.updatePersonalDetailsWithFiles({
        personalDetailsId: this.personalDetailsIdCreated,
        dto: this.personalDetailsForm.value,
        files: {
          cniFile: this.cniFile,
          carteGriseFile: this.carteGriseFile,
          navigoFile: this.navigoFile,
          attestationsFiles: this.attestationsFiles,
          contratFile: this.contratFile,
          kbisFile: this.kbisFile,
          urssafFile: this.urssafFile,
          photoFile: this.photoFile,
          ribFile: this.ribFile,
        },
      })
    );

  } else {
    this.store.dispatch(
      AuthActions.createConsultant({ request: consultantRequest })
    );
  }
}


  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field.invalid && (field.dirty || field.touched);
  }

  toggleCommercial(): void {
    const currentValue = this.consultantForm.get("commercial").value;
    this.consultantForm.get("commercial").setValue(!currentValue);
  }


  onFileChange(event: Event, field: string): void {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  if (field === 'attestationsFiles') {
    this.attestationsFiles = Array.from(target.files);
  } else {
    this[field] = target.files[0];
  }
}

extractFileName(fullPath: string): string {
  if (!fullPath) return '';
  return fullPath.split('/').pop();
}



}
