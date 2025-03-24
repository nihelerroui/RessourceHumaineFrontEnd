
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
import { FactureClientDetailComponent } from "./factureclientdetail/factureclientdetailview/factureclientdetail.component"; // Updated import
import { FactureClientUpdateComponent } from "./factureclientupdate/factureclientupdateview/factureclientupdate.component"; // Updated import
import { CommentModalComponent } from './factureclientcomment-modal/factureclientcomment-modal-view/comment-modal.component';
import { UtilisateurdetailviewComponent } from './utilisateursdetail/utilisateurdetailview/utilisateurdetailview.component';
import { UtilisateurregisterviewComponent } from './utilisateurregister/utilisateurregisterview/utilisateurregisterview.component';
import { UtilisateurAdminUpdateViewComponent } from './utilisateuradminupdate/utilisateuradminupdateview/utilisateuradminupdateview.component';
import { ProfileEditComponent } from './userprofileedit/profileedit.component'; // Updated import
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';

import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
//UtilisateurAdminUpdateViewComponent
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [

    FactureClientDetailComponent,
    FactureClientUpdateComponent,
    CommentModalComponent,
    UtilisateurdetailviewComponent,
    UtilisateurregisterviewComponent,
    UtilisateurAdminUpdateViewComponent,
    ProfileEditComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent // Updated component name
  ],
  imports: [
    CommonModule,
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
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),


  ],
  providers: [DatePipe], // Add DatePipe to providers
})
export class PagesModule {}
