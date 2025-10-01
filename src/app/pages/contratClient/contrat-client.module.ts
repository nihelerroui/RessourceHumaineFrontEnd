import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "src/app/shared/ui/ui.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { SharedModule } from "src/app/shared/shared.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxSliderModule } from "ngx-slider-v2";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { ContratClientAdminComponent } from "./contrat-client/contrat-client.component";
import { contratClientReducer } from "src/app/store/contratClient/contratClient.reducer";
import { ContratClientEffects } from "src/app/store/contratClient/contratClient.effects";
import { HttpClientModule } from "@angular/common/http";

const routes: Routes = [
  {
    path: '',
    component: ContratClientAdminComponent
  }
];
@NgModule({
  declarations: [
    ContratClientAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UIModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgxSliderModule,
    StoreModule.forFeature('contratsClient', contratClientReducer),
    EffectsModule.forFeature([ContratClientEffects]),
  ]
})
export class ContratClientModule { }