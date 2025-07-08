import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { UIModule } from "../../shared/ui/ui.module";
import { WidgetModule } from "../../shared/widget/widget.module";

import { NgApexchartsModule } from "ng-apexcharts";

import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule, BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModalModule } from "ngx-bootstrap/modal";

import { SimplebarAngularModule } from "simplebar-angular";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { StoreModule } from "@ngrx/store";
import { factureClientReducer } from "src/app/store/FactureClient/factureclient.reducer";
import { EffectsModule } from "@ngrx/effects";
import { FactureClientEffects } from "src/app/store/FactureClient/factureclient.effects";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { depenseReducer } from "src/app/store/Depense/depense.reducer";
import { recetteReducer } from "src/app/store/recette/recette.reducer";
import { DepenseEffects } from "src/app/store/Depense/depense.effects";
import { RecetteEffects } from "src/app/store/recette/recette.effects";
import { tresorerieReducer } from "src/app/store/tresorerie/tresorerie.reducer";
import { TresorerieEffects } from "src/app/store/tresorerie/tresorerie.effects";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    UIModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    WidgetModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    ModalModule.forRoot(),
    StoreModule.forFeature("factureClient", factureClientReducer),
    EffectsModule.forFeature([FactureClientEffects]),
    StoreModule.forFeature("depense", depenseReducer),
    StoreModule.forFeature("recettes", recetteReducer),
    EffectsModule.forFeature([DepenseEffects]),
    EffectsModule.forFeature([RecetteEffects]),
    StoreModule.forFeature("tresorerie", tresorerieReducer),
    EffectsModule.forFeature([TresorerieEffects]),
  ],
  providers: [BsDropdownConfig],
})
export class DashboardsModule {}
