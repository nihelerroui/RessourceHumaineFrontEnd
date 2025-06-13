import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { HttpClientModule } from '@angular/common/http';
import { PaysModule } from './pays/pays.module';
import { SocieteModule } from './societe/societe.module';
import { FactureModule } from './facture/facture.module';
import { TresorieModule } from './tresorie/tresorie.module';
import { PrestationsModule } from './prestations/prestations.module';
import { CommentModalComponent } from './factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component';
import { FactureclientAdminModule } from './factureclient-admin/factureclient-admin.module';

import { MainOeuvreModule } from './mainOeuvre/main-oeuvre.module';
import { HistoriqueMainOeuvreModule } from './historique-main-oeuvre/historique-main-oeuvre.module';
import { ImporterContratModule } from './ImportationContrat/importerContrat.module';
import { ContratSousTraitantModule } from './contratSousTraitant/contrat-sous-traitant.module';
import { ContratClient_ClientModule } from './contratClient_Client/contrat-client_Client.module';
import { ContratClientModule } from './contratClient/contrat-client.module';
import { CommentaireContratModule } from './comment-contratClient/comment-contrat.module';
import { CommentaireContratSousTraitantModule } from './comment-contratSousTraitant/comment-contratST.module';
import { UserModule } from './users/user.module';
import { UtilisateurregisterviewComponent } from './users/utilisateurregisterview/utilisateurregisterview.component';
import { RecettesModule } from './recettes/recettes.module';
import { StoreModule } from '@ngrx/store';
import { FactureSousTraitantModule } from './factureSousTraitant/facture-sous-traitant.module';
import { CommentModalModule } from './factureclientcomment-modal/comment-modal.module';


@NgModule({
  declarations: [
    CommentModalComponent,
    UtilisateurregisterviewComponent,
  ],
  imports: [
    CommonModule,
    PaysModule,
    FactureSousTraitantModule,
    SocieteModule,
    FactureModule,
    TresorieModule,
    FactureclientAdminModule,
    HistoriqueMainOeuvreModule,
    PrestationsModule,
    MainOeuvreModule,
    FormsModule,
    RecettesModule,
    CommentModalModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    HttpClientModule,
    UIModule,
    WidgetModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule,
    ImporterContratModule,
    ContratSousTraitantModule,
    ContratClient_ClientModule,
    ContratClientModule,
    CommentaireContratModule,
    CommentaireContratSousTraitantModule

  ],
  providers: [DatePipe],
})
export class PagesModule { }
