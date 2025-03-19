
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common"; // Import DatePipe
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { AlertModule } from "ngx-bootstrap/alert";
import { NgApexchartsModule } from "ng-apexcharts";
import { FullCalendarModule } from "@fullcalendar/angular";
import { SimplebarAngularModule } from "simplebar-angular";
import { LightboxModule } from "ngx-lightbox";
import { WidgetModule } from "../shared/widget/widget.module";
import { UIModule } from "../shared/ui/ui.module";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { PagesRoutingModule } from "./pages-routing.module";
import { DashboardsModule } from "./dashboards/dashboards.module";
import { HttpClientModule } from "@angular/common/http";
import { FactureListComponent } from "./facture/facture-list/facture-list.component"; // Updated import
import { FactureClientDetailComponent } from "./factureclientdetail/factureclientdetailview/factureclientdetail.component"; // Updated import
import { FactureClientUpdateComponent } from "./factureclientupdate/factureclientupdateview/factureclientupdate.component"; // Updated import
import { CommentModalComponent } from './factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component';
import { ContratModule } from './contrat/contrat.module';
import { PaysModule } from './pays/pays.module';
import { SocieteModule } from './societe/societe.module';
import { ClientModule } from './client/client.module';
import { FactureListComponent } from './facture/facture-list/facture-list.component';
import { FactureModule } from './facture/facture.module';
import { TresorieModule } from './tresorie/tresorie.module';
@NgModule({
  declarations: [
    FactureListComponent,
    FactureClientDetailComponent,
    FactureClientUpdateComponent,
    CommentModalComponent, // Updated component name
  ],
  imports: [
    CommonModule,
    PaysModule,
    SocieteModule,
    ClientModule,
    FactureModule,
    TresorieModule,
    FormsModule,
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
  providers: [DatePipe], // Add DatePipe to providers
})
export class PagesModule {}
