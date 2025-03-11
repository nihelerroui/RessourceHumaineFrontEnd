import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { addClient, deleteClient, loadClients, updateClient } from 'src/app/store/client/client.actions';
import { Client } from '../../models/client.model'; 
import { selectClientError, selectClientList, selectClientLoading } from 'src/app/store/client/client.selectors';
import { TypeClient } from 'src/app/pages/models/type-client.enum';
import { loadPays } from 'src/app/store/pays/pays.actions';
import { Pays } from 'src/app/pages/models/pays.model';
import { selectPaysList } from 'src/app/store/pays/pays.selectors';
import { loadSocietes } from 'src/app/store/societe/societe.actions';
import { Societe } from 'src/app/pages/models/societe.model';
import { selectSocieteList } from 'src/app/store/societe/societe.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit{
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  clientList$: Observable<Client[]>;
  societeList$: Observable<Societe[]>;
  paysList$: Observable<Pays[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  modalRef?: BsModalRef;
  clientForm!: FormGroup;
  submitted: boolean = false;
  typeClientOptions = Object.values(TypeClient);

  filteredClientList: Client[] = [];
  paginatedClientList: Client[] = [];
  searchTerm: string = '';
  selectedPays: number | '' = '';
  selectedSociete: number | '' = '';
  selectedTypeClient: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', path: '/' },
      { label: 'Liste des Clients', active: true }
    ];

    // Déclencher l'action NgRx pour charger les clients
    this.store.dispatch(loadClients());
    this.store.dispatch(loadPays());
    this.store.dispatch(loadSocietes());

    // Sélectionner les données depuis le store
    this.paysList$ = this.store.select(selectPaysList);
    this.societeList$ = this.store.select(selectSocieteList);
    this.store.select(selectClientList).subscribe(clients => {
      this.filteredClientList = clients;
      this.pageChanged({ page: 1 }); // Initialisation pagination
    });
    this.loading$ = this.store.select(selectClientLoading);
    this.error$ = this.store.select(selectClientError);

    // Initialisation du formulaire
    this.clientForm = this.formBuilder.group({
      clientId: [''],
      nom: ['', [Validators.required,Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      adresse: ['', [Validators.required]],
      numeroSiret: ['', [Validators.required ,Validators.pattern(/^\d{14}$/)]],
      typeClient: ['', [Validators.required]],
      paysId: ['', [Validators.required]],
      societeId: ['', [Validators.required]]
    });
  }

 /** 🔍 Filtrer la liste des clients */
 filterClients() {
  this.store.select(selectClientList).subscribe(clients => {
    this.filteredClientList = clients.filter(client =>
      (client.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       client.telephone.includes(this.searchTerm)) &&
       (this.selectedPays === '' || client.pays?.paysId == this.selectedPays)       &&
      (this.selectedSociete === '' || client.societe.societeId == this.selectedSociete) &&
      (this.selectedTypeClient === '' || client.typeClient === this.selectedTypeClient)
    );
    this.pageChanged({ page: 1 });
  });
}

  /** 📌 Pagination */
  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedClientList = this.filteredClientList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /** 🔄 Rafraîchir la liste */
  refreshList() {
    this.store.dispatch(loadClients());
  }

  openModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  editDataGet(client: Client, template: TemplateRef<any>) {
    this.submitted = false;
    this.clientForm.patchValue({
      clientId: client.clientId,
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      numeroSiret: client.numeroSiret,
      typeClient: client.typeClient,
      paysId: client.pays?.paysId || '',
      societeId: client.societe?.societeId || ''
    });
  
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  

  /** ✅ Ajouter ou modifier un client */
  saveClient() {
    if (this.clientForm.valid) {
      let clientData = this.clientForm.value;
  
      
      clientData.pays = { paysId: clientData.paysId }; 
      clientData.societe = { societeId: clientData.societeId };

      delete clientData.paysId;
      delete clientData.societeId;
      
  
      if (clientData.clientId) {
        this.store.dispatch(updateClient({ client: clientData }));
        Swal.fire({
          icon: 'success',
          title: 'Client mis à jour avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        this.store.dispatch(addClient({ client: clientData }));
        Swal.fire({
          icon: 'success',
          title: 'Nouveau client ajouté avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      }
  
      this.modalRef?.hide();
      this.clientForm.reset();
    }
  }
  

  /** ✅ Supprimer un client avec confirmation */
  onDeleteClient(clientId: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(deleteClient({ clientId }));
        Swal.fire({
          icon: 'success',
          title: 'Client supprimé avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}


