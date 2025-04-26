import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { combineLatest, filter, map, Observable, take } from "rxjs";
import {
  selectFactureClients,
  selectError,
  selectLoading,
  selectTotalFactureClient,
} from "../../../store/FactureClient/factureclient.selector";
import { CommentModalComponent } from "../../factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component";
import {
  downloadFacture,
  loadFacturesNonPayeesByClientId,
  loadFacturesRejeteesByClientId,
  loadFacturesValideesByClientId,
  updateFactureClient,
} from "src/app/store/FactureClient/factureclient.actions";
import { StatutPaiement } from "src/app/models/statut-paiement.enum";
import { FactureClient } from "src/app/models/factureClient.models";
import { StatutFacture } from "src/app/models/statut-facture.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenUtilService } from "src/app/core/services/token-util.service";

@Component({
  selector: "app-clientfacture",
  templateUrl: "./clientfacture.component.html",
})
export class ClientViewFactureComponent implements OnInit {
  term: string = "";
  modalRef?: BsModalRef;
  factureClients$: Observable<any[]>;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: "DD/MM/YYYY",
  };
  breadCrumbItems = [
    { label: "Factures Clients" },
    { label: "Factures Clients List", active: true },
  ];

  prestations: any[] = [];
  contratsClient: any[] = [];
  factures: any[] = [];
  originalFactures: any[] = [];
  selectedFacture: any;
  StatutPaiement = StatutPaiement;

  statutPaiementFilter: string = "";
  statutFactureFilter: string = "";
  typePaiementFilter: string = "";

  page = 1;
  facturesParPage = 5;
  total$: Observable<number> = this.store.select(selectTotalFactureClient);
  facturesPagination$: Observable<FactureClient[]> = new Observable();
  filteredFactures$: Observable<FactureClient[]> = new Observable();
  lists: any[] = [];
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tokenUtil: TokenUtilService,
    private router: Router,
    public store: Store,
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    const type = this.route.snapshot.queryParamMap.get('type'); 
  
    if (this.token) {
      const clientId = this.tokenUtil.extractClientId(this.token);
      console.log("📦 ID du client extrait du token :", clientId);
  
      if (type === 'rejete') {
        this.store.dispatch(loadFacturesRejeteesByClientId({ clientId }));
      } else if (type === 'nonpayee') {
        this.store.dispatch(loadFacturesNonPayeesByClientId({ clientId }));
      } else {
        this.store.dispatch(loadFacturesValideesByClientId({ clientId }));
      }
  
    } else {
      const clientId = 1;
      this.store.dispatch(loadFacturesValideesByClientId({ clientId }));
    }
    this.factureClients$ = this.store.select(selectFactureClients);
    this.filteredFactures$ = this.store.select(selectFactureClients).pipe(
      map(factures => factures.slice(0, this.facturesParPage))
    );
    
  }
   
  //pagination
  updatePagination() {
    this.facturesPagination$ = combineLatest([this.factureClients$]).pipe(
      map(([factures]) => {
        const start = (this.page - 1) * this.facturesParPage;
        return factures.slice(start, start + this.facturesParPage);
      })
    );
    this.filteredFactures$ = this.facturesPagination$;
  }

  modifierStatutFacture(facture: any, nouveauStatut: StatutFacture): void {
    const factureDto = {
      factureClientId: facture.factureClientId,
      consultantId: facture.consultant?.consultantId ?? facture.consultantId,
      contratId: facture.contratClient?.contratClientId ?? facture.contratId,
      dateEcheance: facture.dateEcheance,
      typePaiement: facture.typePaiement,
      pourcentageRemise: facture.pourcentageRemise,
      objet: facture.objet,
      numBonCommande: facture.numBonCommande,
      refFacture: facture.refFacture,
      montantHt: facture.montantHt,
      montantTtc: facture.montantTtc,
      montantTva: facture.montantTva,
      pourcentageTva: facture.pourcentageTva,
      dateEmmission: facture.dateEmmission,
      statutPaiement: facture.statutPaiement,
      statutFacture: nouveauStatut,
      prestations: (facture.prestations ?? []).map((p: any) => ({
        prestationId: p.prestationId,
        quantite: p.quantite,
        prixUnitaire: p.prixUnitaire,
      })),
    };

    this.store.dispatch(updateFactureClient({ facture: factureDto }));
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Statut mis à jour",
        text: "La facture a bien été mise à jour.",
        timer: 1000,
        showConfirmButton: false,
      });
  
      this.store.dispatch(loadFacturesValideesByClientId({ clientId: 1 }));
    }, 500);
  }

  searchFactureClient(): void {
    const lowerTerm = this.term.toLowerCase();

    this.factureClients$.subscribe((data) => {
      const filtered = data.filter((facture) =>
        Object.values(facture).some((value) =>
          value?.toString().toLowerCase().includes(lowerTerm)
        )
      );

      this.originalFactures = data;
      this.factures = filtered;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.factureClients$.subscribe((factures) => {
      let filtered = [...factures];

      const term = this.term.toLowerCase().trim();
      const statutFacture = this.statutFactureFilter.toUpperCase().trim();
      const typePaiement = this.typePaiementFilter.toUpperCase().trim();
      const statutPaiement = this.statutPaiementFilter.toUpperCase().trim();

      if (term) {
        filtered = filtered.filter((f) =>
          Object.values(f).some((value) =>
            value?.toString().toLowerCase().includes(term)
          )
        );
      }

      if (statutFacture) {
        filtered = filtered.filter(
          (f) => f.statutFacture?.toUpperCase() === statutFacture
        );
      }

      if (typePaiement) {
        filtered = filtered.filter(
          (f) => f.typePaiement?.toUpperCase() === typePaiement
        );
      }

      if (statutPaiement) {
        filtered = filtered.filter(
          (f) => f.statutPaiement?.toUpperCase() === statutPaiement
        );
      }

      this.factures = filtered;
      this.filteredFactures$ = new Observable((observer) => {
        observer.next(filtered);
        observer.complete();
      });
    });
  }

  resetFilters(): void {
    this.term =
      this.statutPaiementFilter =
      this.statutFactureFilter =
      this.typePaiementFilter =
      "";
    this.applyFilters();
  }

  openCommentModal(facture: FactureClient | number): void {
    const factureId = typeof facture === 'number' ? facture : facture.factureClientId;
    const emailClient = typeof facture === 'number'
      ? 'inconnu@featway.com'
      : facture.contratClient?.client?.email || 'inconnu@featway.com';

    if (!factureId) {
      console.error("factureId est undefined !");
      return;
    }

    this.modalRef = this.modalService.show(CommentModalComponent, {
      class: "modal-lg",
      initialState: {
        factureId,
        currentUserEmail: emailClient,
        isClientMode: true,
      }
    });
  }
  openDetailsModal(facture: any, template: TemplateRef<any>): void {
    this.selectedFacture = facture;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
  downloadFacture(factureId: number): void {
    this.store.dispatch(downloadFacture({ factureClientId: factureId }));
  }
}

