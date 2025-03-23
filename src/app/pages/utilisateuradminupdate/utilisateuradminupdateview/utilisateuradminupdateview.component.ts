import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-utilisateuradminupdateview',
  templateUrl: './utilisateuradminupdateview.component.html',
  styleUrls: ['./utilisateuradminupdateview.component.scss'],
})
export class UtilisateurAdminUpdateViewComponent implements OnInit {
  userForm: FormGroup;
  userId: number;
  isLoading = false;
  @Input() user: any; // Receive the user object from the parent
  selectedFile: File | null = null;
  
  // Tab and accordion state management
  activeTab = 'account';
  accordionState = {
    address: false,
    banking: false,
    identity: false,
    documents: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public modalRef: BsModalRef // Inject modal reference
  ) {}

  ngOnInit(): void {
    // Get userId from route or input
    if (this.route.snapshot.paramMap.get('userId')) {
      this.userId = +this.route.snapshot.paramMap.get('userId')!;
    } else if (this.user && this.user.userId) {
      this.userId = this.user.userId;
    }

    this.initForm();
    
    if (this.userId) {
      this.loadUserData();
    } else if (this.user) {
      this.patchFormWithUserData(this.user);
    }
  }

  // Initialize the form with all fields from the DTO
  initForm(): void {
    this.userForm = this.fb.group({
      // User fields
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      enabled: [true],
      
      // Consultant fields
      fullName: [''],
      name: [''],
      prenom: [''],
      telephone: [''],
      typeLibelle: [''],
      dateRecrutement: [null],
      dateSortie: [null],
      fonction: [''],
      matricule: [''],
      commercial: [false],
      
      // Personal Details fields
      attestations: [''],
      bic: [''],
      bisTer: [''],
      carteGrise: [''],
      cni: [''],
      codePostal: [''],
      complementAdr: [''],
      contart: [''],
      dateDebCni: [null],
      dateFinCni: [null],
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
  }

  // Load user data to prefill the form
  loadUserData(): void {
    this.isLoading = true;
    this.authService.getAllUser().subscribe(
      (users) => {
        const user = users.find((user) => user.userId === this.userId);
        if (user) {
          this.patchFormWithUserData(user);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Utilisateur non trouvé',
            text: 'Impossible de trouver les informations de l\'utilisateur',
            confirmButtonText: 'OK'
          });
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur de chargement',
          text: 'Impossible de charger les données de l\'utilisateur',
          confirmButtonText: 'OK'
        });
        console.error('Error loading user data:', error);
      }
    );
  }

  // Patch form with user data
  patchFormWithUserData(user: any): void {
    // Create a data object with all possible fields
    const formData: any = {
      email: user.email,
      role: user.role,
      enabled: user.enabled
    };

    // Add consultant data if available
    if (user.consultant) {
      formData.fullName = user.consultant.fullName;
      formData.name = user.consultant.name;
      formData.prenom = user.consultant.prenom;
      formData.telephone = user.consultant.telephone;
      formData.typeLibelle = user.consultant.typeLibelle;
      formData.dateRecrutement = user.consultant.dateRecrutement;
      formData.dateSortie = user.consultant.dateSortie;
      formData.fonction = user.consultant.fonction;
      formData.matricule = user.consultant.matricule;
      formData.commercial = user.consultant.commercial;

      // Add personal details if available
      if (user.consultant.personalDetails) {
        const pd = user.consultant.personalDetails;
        formData.attestations = pd.attestations;
        formData.bic = pd.bic;
        formData.bisTer = pd.bisTer;
        formData.carteGrise = pd.carteGrise;
        formData.cni = pd.cni;
        formData.codePostal = pd.codePostal;
        formData.complementAdr = pd.complementAdr;
        formData.contart = pd.contart;
        formData.dateDebCni = pd.dateDebCni;
        formData.dateFinCni = pd.dateFinCni;
        formData.iban = pd.iban;
        formData.kbis = pd.kbis;
        formData.navigo = pd.navigo;
        formData.nomRue = pd.nomRue;
        formData.numRue = pd.numRue;
        formData.nummss = pd.nummss;
        formData.photo = pd.photo;
        formData.rib = pd.rib;
        formData.urssaf = pd.urssaf;
        formData.ville = pd.ville;
      }
    }

    // Patch the form with the data
    this.userForm.patchValue(formData);
  }

  // Tab management
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Accordion management
  toggleAccordion(sectionId: string): void {
    this.accordionState[sectionId] = !this.accordionState[sectionId];
  }

  // Handle file selection for photo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // You would typically upload this file to your server and get a URL back
      // For now, we'll just store the file name in the form
      this.userForm.patchValue({
        photo: file.name
      });
    }
  }

  // Handle form submission (update user)
  onSubmit(): void {
    if (this.userForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Veuillez corriger les erreurs dans le formulaire',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const updateData = this.userForm.value;
    this.isLoading = true;
  
    this.authService.updateUser(this.userId, updateData).subscribe(
      (response) => {
        this.isLoading = false;
  
        Swal.fire({
          icon: "success",
          title: "Utilisateur mis à jour avec succès!",
          showConfirmButton: false,
          timer: 1500,
        });
  
        // Emit event for user update
        //this.authService.userCreated$.next(true);
  
        // Close the modal
        setTimeout(() => {
          this.closeModal(); // Ensure this method exists to close the modal
        }, 1600);
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "Erreur lors de la mise à jour",
          text: "Une erreur s'est produite lors de la mise à jour de l'utilisateur.",
          confirmButtonText: 'OK'
        });
        console.error('Error updating user:', error);
      }
    );
  }
  
  // Close modal method
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  cancel(): void {
    this.closeModal();
  }
  
}