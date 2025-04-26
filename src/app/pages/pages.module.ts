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
import { ContratModule } from './contrat/contrat.module';
import { PaysModule } from './pays/pays.module';
import { SocieteModule } from './societe/societe.module';
import { FactureModule } from './facture/facture.module';
import { TresorieModule } from './tresorie/tresorie.module';
import { PrestationsModule } from './prestations/prestations.module';
import { FactureClientModule } from './factureclient/factureclient.module';
import { CommentModalComponent } from './factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component';
import { FactureclientAdminModule } from './factureclient-admin/factureclient-admin.module';
import { CommentModalModule } from './factureclientcomment-modal/comment-modal.module';


@NgModule({
  declarations: [
    CommentModalComponent,
  ],
  imports: [
    CommonModule,
    PaysModule,
    SocieteModule,
    FactureModule,
    TresorieModule,
    FactureClientModule,
    FactureclientAdminModule,
    PrestationsModule,
    FormsModule,
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
    ContratModule
  ],
  providers: [DatePipe],
})
export class PagesModule { }
