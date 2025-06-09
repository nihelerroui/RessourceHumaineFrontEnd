import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FactureSousTraitantRoutingModule } from "./facture-sous-traitant-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { FactureSousTraitantReducer } from "src/app/store/factureSousTraitant/factureSousTraitant.reducer";
import { EffectsModule } from "@ngrx/effects";
import { FactureSousTraitantEffects } from "src/app/store/factureSousTraitant/factureSousTraitant.effects";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { UIModule } from "src/app/shared/ui/ui.module";
import { FactureSousTraitantComponent } from "./facture-sous-traitant/facture-sous-traitant.component";

@NgModule({
  declarations: [
    FactureSousTraitantComponent
  ],
  imports: [
    CommonModule,
    FactureSousTraitantRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature("FactureSousTraitant", FactureSousTraitantReducer),
    EffectsModule.forFeature([FactureSousTraitantEffects]),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
  ],
})
export class FactureSousTraitantModule {}
