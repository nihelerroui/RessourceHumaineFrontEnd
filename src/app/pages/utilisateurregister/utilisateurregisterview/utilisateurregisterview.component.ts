import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthenticationService, AdminRegisterRequest } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService for notifications

enum UserRole {
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  RESPONSABLE_FINANCIER = 'RESPONSABLE_FINANCIER',
  SOUS_TRAITANT = 'SOUS_TRAITANT'
}

@Component({
  selector: 'app-utilisateurregisterview',
  templateUrl: './utilisateurregisterview.component.html',
  styleUrls: ['./utilisateurregisterview.component.scss']
})
export class UtilisateurregisterviewComponent implements OnInit {
  // Step tracking
  currentStep = 1;
  totalSteps = 3;
  
  // Forms for each step
  userForm: FormGroup;
  consultantForm: FormGroup;
  personalDetailsForm: FormGroup;
  
  // Role options
  roles = Object.values(UserRole);
  
  // Password strength
  passwordStrength = 0;
  
  // Role descriptions for the visual selector
  roleDescriptions = {
    [UserRole.ADMINISTRATEUR]: 'Accès complet au système avec tous les privilèges administratifs',
    [UserRole.RESPONSABLE_FINANCIER]: 'Gestion des aspects financiers et comptables',
    [UserRole.SOUS_TRAITANT]: 'Accès limité aux fonctionnalités spécifiques aux sous-traitants'
  };
  
  // Role icons for visual selector
  roleIcons = {
    [UserRole.ADMINISTRATEUR]: 'fa-user-shield',
    [UserRole.RESPONSABLE_FINANCIER]: 'fa-chart-line',
    [UserRole.SOUS_TRAITANT]: 'fa-user-cog'
  };

  // Loading state for API calls
  isSubmitting = false;

  constructor(
    public bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    // Step 1: User credentials form
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Step 2: Consultant information form
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

    // Step 3: Personal details form (optional fields)
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

    // Listen for password changes to calculate strength
    this.userForm.get('password').valueChanges.subscribe(password => {
      this.calculatePasswordStrength(password);
    });
  }

  // Format role name for display (convert ROLE_NAME to Role Name)
  formatRoleName(role: string): string {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }

  // Calculate password strength (0-100)
  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 20; // Uppercase
    if (/[a-z]/.test(password)) strength += 15; // Lowercase
    if (/[0-9]/.test(password)) strength += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special characters
    
    this.passwordStrength = Math.min(100, strength);
  }

  // Get color for password strength bar
  getPasswordStrengthColor(): string {
    if (this.passwordStrength < 40) return 'danger';
    if (this.passwordStrength < 70) return 'warning';
    return 'success';
  }

  // Get text description for password strength
  getPasswordStrengthText(): string {
    if (this.passwordStrength < 40) return 'Faible';
    if (this.passwordStrength < 70) return 'Moyen';
    return 'Fort';
  }

  // Navigation between steps
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

  // Form submission
  createUser(): void {
    if (this.userForm.valid && this.consultantForm.valid) {
      this.isSubmitting = true;
      
      // Prepare the request data with all required fields
      const registerData: AdminRegisterRequest = {
        // User fields
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role,
        enabled: true, // Set to true or you can modify based on your requirement
        
        // Consultant fields
        fullName: this.consultantForm.value.fullName,
        name: this.consultantForm.value.name,
        prenom: this.consultantForm.value.prenom,
        telephone: this.consultantForm.value.telephone,
        typeLibelle: this.consultantForm.value.typeLibelle,
        dateRecrutement: this.consultantForm.value.dateRecrutement,
        dateSortie: this.consultantForm.value.dateSortie || null,  // Use null if dateSortie is empty
        fonction: this.consultantForm.value.fonction,
        matricule: this.consultantForm.value.matricule,
        commercial: this.consultantForm.value.commercial,
        
        // Personal details fields
        ...this.personalDetailsForm.value
      };
  
      // Send the register request to the backend
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.toastr.success('Utilisateur créé avec succès!', 'Succès');
          console.log('User created:', response);
          this.bsModalRef.hide();
  
          // Notify the list component to reload users
          this.authService.notifyUserCreated();
        },
        error: (error) => {
          this.isSubmitting = false;
          
          // Handle specific error messages from the backend
          if (error.error === 'Email address already in use') {
            this.toastr.error('Cette adresse email est déjà utilisée.', 'Erreur');
          } else {
            this.toastr.error('Une erreur s\'est produite lors de la création de l\'utilisateur.', 'Erreur');
          }
          
          console.error('Error creating user:', error);
        }
      });
    }
  }
  
  

  // Helper to check if a field is invalid and touched
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field.invalid && (field.dirty || field.touched);
  }

  // Toggle commercial status
  toggleCommercial(): void {
    const currentValue = this.consultantForm.get('commercial').value;
    this.consultantForm.get('commercial').setValue(!currentValue);
  }
}