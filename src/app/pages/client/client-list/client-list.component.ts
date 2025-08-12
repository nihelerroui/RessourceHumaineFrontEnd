import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import * as AuthActions from "src/app/store/Authentication/authentication.actions";
import * as ClientActions from "src/app/store/client/client.actions";
import { Client } from "../../../models/client.model";
import * as ClientSelectors from "src/app/store/client/client.selectors";
import { TypeClient } from "src/app/models/type-client.enum";
import { loadPays } from "src/app/store/pays/pays.actions";
import { Pays } from "src/app/models/pays.model";
import { selectPaysList } from "src/app/store/pays/pays.selectors";
import Swal from "sweetalert2";
import { selectAllSocietes } from "src/app/store/Authentication/authentication-selector";

@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html",
  styleUrls: ["./client-list.component.css"],
})
export class ClientListComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; path?: string; active?: boolean }>;
  clientList$: Observable<Client[]>;
  paysList$: Observable<Pays[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  modalRef?: BsModalRef;
  clientForm!: FormGroup;
  submitted: boolean = false;
  typeClientOptions = Object.values(TypeClient);

  filteredClientList: Client[] = [];
  paginatedClientList: Client[] = [];
  searchTerm: string = "";
  selectedPays: number | "" = "";

  selectedTypeClient: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 8;

  selectedClient!: Client | null;

  selectedSocieteId: number | null = null;

  adminSocietes: any[] = [];
  consultantSocieteId: number | null = null;

  adminSocietes$: Observable<any[]>;

  clientList: Client[] = [];

  role: string = "";

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public store: Store
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard", path: "/" },
      { label: "Liste des Clients", active: true },
    ];

    const currentUser = JSON.parse(
      sessionStorage.getItem("currentUser") || "{}"
    );
    this.consultantSocieteId = currentUser.societe?.societeId;
    this.selectedSocieteId = Number(this.consultantSocieteId);
    this.role = currentUser?.user?.role || "";

    this.store.dispatch(ClientActions.loadClients());
    this.store.dispatch(loadPays());
    this.store.dispatch(AuthActions.loadAdminSocietes());

    this.paysList$ = this.store.select(selectPaysList);
    this.adminSocietes$ = this.store.select(selectAllSocietes);

    this.adminSocietes$.subscribe((societes) => {
      this.adminSocietes = societes;

      const match = societes.find(
        (s) => s.societeId === this.consultantSocieteId
      );

      if (match) {
        this.selectedSocieteId = match.societeId;
      } else if (societes.length > 0) {
        this.selectedSocieteId = societes[0].societeId;
      }

      this.filterClients();
    });

    this.store.select(ClientSelectors.selectClientList).subscribe((clients) => {
      this.clientList = clients;
      this.filterClients();
    });

    this.loading$ = this.store.select(ClientSelectors.selectClientLoading);
    this.error$ = this.store.select(ClientSelectors.selectClientError);

    this.initClientForm();
  }

  filterClients() {
    this.filteredClientList = this.clientList.filter((client) => {
      const searchMatch =
        client.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.telephone?.includes(this.searchTerm);

      const paysMatch =
        !this.selectedPays || client.pays?.paysId === +this.selectedPays;

      const societeMatch =
        !this.selectedSocieteId ||
        client.societe?.societeId === this.selectedSocieteId;

      const typeClientMatch =
        !this.selectedTypeClient ||
        client.typeClient === this.selectedTypeClient;

      return searchMatch && paysMatch && societeMatch && typeClientMatch;
    });

    this.pageChanged({ page: 1 });
  }

  initClientForm(): void {
    this.clientForm = this.formBuilder.group({
      clientId: [null],
      nom: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      telephone: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      adresse: ["", [Validators.required]],
      numeroSiret: ["", Validators.required],
      typeClient: ["", [Validators.required]],
      paysId: ["", [Validators.required]],
      societeId: ["", [Validators.required]],
    });
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedClientList = this.filteredClientList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  refreshList() {
    this.store.dispatch(ClientActions.loadClients());
  }

  openModalAdd(template: TemplateRef<any>) {
    this.clientForm.reset();
    this.clientForm.patchValue({ clientId: null });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  openModalEdit(client: any, template: TemplateRef<any>) {
    this.clientForm.patchValue({
      clientId: client.clientId,
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      numeroSiret: client.numeroSiret,
      typeClient: client.typeClient,
      paysId: client.pays?.paysId || "",
      societeId: client.societe?.societeId || "",
    });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  saveClient() {
    if (this.clientForm.valid) {
      let clientData = this.clientForm.value;

      clientData.pays = { paysId: clientData.paysId };
      clientData.societe = { societeId: clientData.societeId };

      delete clientData.paysId;
      delete clientData.societeId;

      if (clientData.clientId) {
        this.store.dispatch(ClientActions.updateClient({ client: clientData }));
        Swal.fire({
          icon: "success",
          title: "Client mis à jour avec succès !",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        this.store.dispatch(ClientActions.addClient({ client: clientData }));
        Swal.fire({
          icon: "success",
          title: "Nouveau client ajouté avec succès !",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      this.modalRef?.hide();
      this.clientForm.reset();
    }
  }

  onDeleteClient(clientId: number) {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(ClientActions.deleteClient({ clientId }));
        Swal.fire({
          icon: "success",
          title: "Client supprimé avec succès !",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  openDetailsModal(client: any, template: TemplateRef<any>) {
    this.selectedClient = client;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
  envoyerEmailImport(clientId: number) {
    this.store.dispatch(ClientActions.sendImportEmail({ clientId }));
  }
}
