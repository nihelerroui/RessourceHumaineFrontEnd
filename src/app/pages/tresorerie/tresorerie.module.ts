import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TresorerieRoutingModule } from "./tresorerie-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { UIModule } from "src/app/shared/ui/ui.module";
import { TresorerieComponent } from "./tresorerie/tresorerie.component";
import { StoreModule } from "@ngrx/store";
import { tresorerieReducer } from "src/app/store/tresorerie/tresorerie.reducer";
import { EffectsModule } from "@ngrx/effects";
import { TresorerieEffects } from "src/app/store/tresorerie/tresorerie.effects";
import { depenseReducer } from "src/app/store/Depense/depense.reducer";
import { recetteReducer } from "src/app/store/recette/recette.reducer";
import { DepenseEffects } from "src/app/store/Depense/depense.effects";
import { RecetteEffects } from "src/app/store/recette/recette.effects";

@NgModule({
  declarations: [
    TresorerieComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    TresorerieRoutingModule,
    StoreModule.forFeature('tresorerie', tresorerieReducer),
    EffectsModule.forFeature([TresorerieEffects]),
    StoreModule.forFeature('depense', depenseReducer),
    StoreModule.forFeature('recettes', recetteReducer),
    EffectsModule.forFeature([DepenseEffects]),
    EffectsModule.forFeature([RecetteEffects]),

    

  ],
})
export class TresorerieModule {}
