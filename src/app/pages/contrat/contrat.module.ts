import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ContratRoutingModule } from './contrat-routing.module';
import { ContratSousTraitantComponent } from './contrat-sous-traitant/contrat-sous-traitant.component';
import { ContratClientAdminComponent } from './contrat-client/contrat-client.component';

import { UIModule } from 'src/app/shared/ui/ui.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';

import { contratReducer } from 'src/app/store/contrat/contrat.reducer';

import { ContratEffects } from 'src/app/store/contrat/contrat.effects';
import { ListeContratSousTraitantComponent } from './liste-contrat-sous-traitant/liste-contrat-sous-traitant.component'; // ✅ Ne pas redéclarer ici

@NgModule({
  declarations: [
    ContratSousTraitantComponent,
    ContratClientAdminComponent,
    ListeContratSousTraitantComponent
  ],
  imports: [
    CommonModule,
    ContratRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    WidgetModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    NgApexchartsModule,
    SimplebarAngularModule,
    ModalModule.forRoot(),

    
    StoreModule.forFeature('contrats', contratReducer),
    EffectsModule.forFeature([ContratEffects])
  ]
})
export class ContratModule {}
