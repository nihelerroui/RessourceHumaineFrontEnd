import { Component, OnInit, TemplateRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { map, Observable } from "rxjs";
import * as factureSelector from "../../../store/FactureClient/factureclient.selector";
import { CommentModalComponent } from "../../factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component";
import * as factureAction from "src/app/store/FactureClient/factureclient.actions";
import { StatutPaiement } from "src/app/models/statut-paiement.enum";
import { FactureClient } from "src/app/models/factureClient.models";
import { StatutFacture } from "src/app/models/statut-facture.enum";
import { ActivatedRoute } from "@angular/router";
import { TokenUtilService } from "src/app/core/services/token-util.service";

@Component({
  selector: "app-clientfacture",
  templateUrl: "./clientfacture.component.html",
})
export class ClientViewFactureComponent implements OnInit {
  term: string = "";
  modalRef?: BsModalRef;
  factureClients$: Observable<any[]>;
  loading$ = this.store.select(factureSelector.selectLoading);
  error$ = this.store.select(factureSelector.selectError);
  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: "DD/MM/YYYY",
  };
  breadCrumbItems = [
    { label: "Factures Clients" },
    { label: "Factures Clients List", active: true },
  ];

  selectedFacture: any;
  StatutPaiement = StatutPaiement;

  statutPaiementFilter: string = "";
  statutFactureFilter: string = "";
  typePaiementFilter: string = "";

  page = 1;
  facturesParPage = 5;
  filteredFactures: FactureClient[] = [];

  paginatedFactures: FactureClient[] = [];
  allFactures: FactureClient[] = [];
  total$: Observable<number> = this.store.select(factureSelector.selectTotalFactureClient);
  token: string | null = null;
  clientId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private tokenUtil: TokenUtilService,
    public store: Store,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    const type = this.route.snapshot.queryParamMap.get('type');

    if (this.token) {
      this.clientId = this.tokenUtil.extractClientId(this.token);
      console.log("📦 ID du client extrait du token :", this.clientId);
    } else {
      this.clientId = 1;
    }

    this.factureClients$ = this.store.select(factureSelector.selectFactureClients);

    this.factureClients$.subscribe(factures => {
      this.allFactures = factures;
      this.filterFactures();
    });

    if (type === 'rejete') {
      this.store.dispatch(factureAction.loadFacturesRejeteesByClientId({ clientId: this.clientId }));
    } else if (type === 'nonpayee') {
      this.store.dispatch(factureAction.loadFacturesNonPayeesByClientId({ clientId: this.clientId }));
    } else {
      this.store.dispatch(factureAction.loadFacturesValideesByClientId({ clientId: this.clientId }));
    }
  }

  //pagination
  filterFactures() {
    const termLower = this.term.toLowerCase().trim();
    this.filteredFactures = this.allFactures.filter(f =>
      (!termLower || f.refFacture?.toLowerCase().includes(termLower)) &&
      (!this.statutFactureFilter || f.statutFacture === this.statutFactureFilter) &&
      (!this.statutPaiementFilter || f.statutPaiement === this.statutPaiementFilter) &&
      (!this.typePaiementFilter || f.typePaiement === this.typePaiementFilter)
    );
    this.pageChanged({ page: 1 });
  }

  pageChanged(event: any) {
    this.page = event.page;
    const start = (this.page - 1) * this.facturesParPage;
    this.paginatedFactures = this.filteredFactures.slice(start, start + this.facturesParPage);
  }
  refreshList() {
    this.term = '';
    this.statutFactureFilter = '';
    this.statutPaiementFilter = '';
    this.typePaiementFilter = '';
    this.page = 1;
    this.store.dispatch(factureAction.loadFacturesValideesByClientId({ clientId: this.clientId }));
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

    this.store.dispatch(factureAction.updateFactureClientWithToken({
      facture: factureDto,
      token: this.token ?? undefined

    }));

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Statut mis à jour",
        text: "La facture a bien été mise à jour.",
        timer: 1000,
        showConfirmButton: false,
      });

      if (this.clientId !== null) {
        this.store.dispatch(factureAction.loadFacturesValideesByClientId({ clientId: this.clientId }));
      }
    }, 500);
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
        token: this.token
      }
    });
  }
  openDetailsModal(facture: any, template: TemplateRef<any>): void {
    this.selectedFacture = facture;
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
  downloadFacture(factureId: number): void {
    this.store.dispatch(factureAction.downloadFactureWithToken({ factureClientId: factureId, token: this.token!}));
  }
}