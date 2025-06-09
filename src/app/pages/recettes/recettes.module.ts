import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RecettesRoutingModule } from "./recettes-routing.module";
import { recetteReducer } from "src/app/store/recette/recette.reducer";
import { StoreModule } from "@ngrx/store";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RecetteEffects } from "src/app/store/recette/recette.effects";
import { EffectsModule } from "@ngrx/effects";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { UIModule } from "src/app/shared/ui/ui.module";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { RecettesListComponent } from "./recettes-list/recettes-list.component";

@NgModule({
  declarations: [
    RecettesListComponent
  ],
  imports: [
    CommonModule,
    RecettesRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature("recettes", recetteReducer),
    EffectsModule.forFeature([RecetteEffects]),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
  ],
})
export class RecettesModule {}
