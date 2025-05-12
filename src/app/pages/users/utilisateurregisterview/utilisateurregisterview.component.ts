import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {  User } from 'src/app/models/auth.models';
import { Store } from '@ngrx/store';
import { registerUser, registerUserSuccess, updateUser, updateUserSuccess } from 'src/app/store/Authentication/authentication.actions';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { loadUsers } from 'src/app/store/user/user.actions';
import { UserRole } from 'src/app/models/userRole.enum';
import { AuthenticationService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-utilisateurregisterview',
  templateUrl: './utilisateurregisterview.component.html',
  styleUrls: ['./utilisateurregisterview.component.scss']
})
export class UtilisateurregisterviewComponent implements OnInit {

  @Input() mode: 'add' | 'edit' = 'add';
  @Input() user: User | null = null;

  societes: any[] = [];

  currentStep = 1;
  totalSteps = 3;
  userForm: FormGroup;
  consultantForm: FormGroup;
  personalDetailsForm: FormGroup;
  roles = Object.values(UserRole);
  passwordStrength = 0;
  isSubmitting = false;
  
  roleDescriptions = {
    [UserRole.ADMINISTRATEUR]: 'Accès complet au système avec tous les privilèges administratifs',
    [UserRole.RESPONSABLE_FINANCIER]: 'Gestion des aspects financiers et comptables',
    [UserRole.SOUS_TRAITANT]: 'Accès limité aux fonctionnalités spécifiques aux sous-traitants'
  };

  roleIcons = {
    [UserRole.ADMINISTRATEUR]: 'fa-user-shield',
    [UserRole.RESPONSABLE_FINANCIER]: 'fa-chart-line',
    [UserRole.SOUS_TRAITANT]: 'fa-user-cog'
  };
 

  constructor(
    public bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.initForms();

   this.authService.getAdminSocietes().subscribe(
  (response) => {
    this.societes = response;
    console.log("Sociétés chargées :", this.societes);
  },
  (error) => {
    console.error("Erreur lors du chargement des sociétés :", error.message);
    console.error("Détails de l'erreur :", error);
    if (error.status === 500) {
      console.error("Erreur interne du serveur. Vérifiez les logs backend.");
    } else if (error.status === 401) {
      console.error("Erreur d'authentification. Vérifiez le token.");
    } else if (error.status === 403) {
      console.error("Accès refusé. Vérifiez les permissions.");
    }
  }
);



    if (this.mode === 'edit' && this.user) {
      this.patchFormWithUser(this.user);
    }
    
    this.actions$.pipe(ofType(updateUserSuccess)).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur modifié avec succès'
      });
      this.store.dispatch(loadUsers());
      this.bsModalRef.hide();
    });
    
    
    this.actions$.pipe(ofType(registerUserSuccess)).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur ajouté avec succès'
      });
      this.store.dispatch(loadUsers());
      this.bsModalRef.hide();
    });
    
  }

  initForms(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      societeId: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.consultantForm = this.fb.group({
      fullName: ['', Validators.required],
      name: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      typeLibelle: ['', Validators.required],
      dateRecrutement: ['', Validators.required],
      dateSortie: [''],
      fonction: ['', Validators.required],
      matricule: ['', Validators.required],
      commercial: [false]
    });

    this.personalDetailsForm = this.fb.group({
      attestations: [''],
      bic: [''],
      bisTer: [''],
      carteGrise: [''],
      cni: [''],
      codePostal: [''],
      complementAdr: [''],
      contart: [''],
      dateDebCni: [''],
      dateFinCni: [''],
      iban: [''],
      kbis: [''],
      navigo: [''],
      nomRue: [''],
      numRue: [''],
      nummss: [''],
      photo: [''],
      rib: [''],
      urssaf: [''],
      ville: ['']
    });

    this.userForm.get('password').valueChanges.subscribe(password => {
      this.calculatePasswordStrength(password);
    });
  }

  patchFormWithUser(user: User): void {
    this.userForm.patchValue({
      email: user.email,
      password: '********',
      confirmPassword: '********',
      role: user.role
    });
  
    const c = user.consultant ?? {} as any;
    this.consultantForm.patchValue({
      fullName: c.fullName,
      name: c.name,
      prenom: c.prenom,
      telephone: c.telephone,
      typeLibelle: c.typeLibelle,
      dateRecrutement: c.dateRecrutement,
      dateSortie: c.dateSortie,
      fonction: c.fonction,
      matricule: c.matricule,
      commercial: c.commercial,
  
    });

     if (c.societe && c.societe.societeId) {
    this.userForm.patchValue({ societeId: c.societe.societeId });
  }
  
    const d = c.personalDetails ?? {} as any;
    this.personalDetailsForm.patchValue(d);
  }
  
  formatRoleName(role: string): string {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
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
    if (this.passwordStrength < 40) return 'danger';
    if (this.passwordStrength < 70) return 'warning';
    return 'success';
  }

  getPasswordStrengthText(): string {
    if (this.passwordStrength < 40) return 'Faible';
    if (this.passwordStrength < 70) return 'Moyen';
    return 'Fort';
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.userForm.valid) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.consultantForm.valid) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm(): void {
    if (this.userForm.invalid || this.consultantForm.invalid) return;
  
    const request: any = {
      ...this.userForm.value,
      ...this.consultantForm.value,
      ...this.personalDetailsForm.value,
      enabled: true
    };


    if (this.mode === 'edit') {
      delete request.password;
      delete request.confirmPassword;
    }
  
    this.isSubmitting = true;
  
    if (this.mode === 'edit' && this.user?.userId) {
      this.store.dispatch(updateUser({ userId: this.user.userId, request }));
    } else {
      this.store.dispatch(registerUser({ request }));
    }
  
    setTimeout(() => this.bsModalRef.hide(), 1000);
  }
  
  
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field.invalid && (field.dirty || field.touched);
  }

  toggleCommercial(): void {
    const currentValue = this.consultantForm.get('commercial').value;
    this.consultantForm.get('commercial').setValue(!currentValue);
  }
}