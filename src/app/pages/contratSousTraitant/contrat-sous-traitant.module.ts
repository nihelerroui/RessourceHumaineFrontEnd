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
import { ContratSousTraitantComponent } from "./contrat-sous-traitant/contrat-sous-traitant.component";
import { contratReducer } from "src/app/store/contratSousTraitant/contrat.reducer";
import { ContratEffects } from "src/app/store/contratSousTraitant/contrat.effects";

const routes: Routes = [
  {
    path: '',
    component: ContratSousTraitantComponent
  }
];
@NgModule({
  declarations: [
    ContratSousTraitantComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UIModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgxSliderModule,
    StoreModule.forFeature('contrats', contratReducer),
    EffectsModule.forFeature([ContratEffects]),
  ]
})
export class ContratSousTraitantModule { }