import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratRoutingModule } from './contrat-routing.module';
import { ContratSousTraitantComponent } from './contrat-sous-traitant/contrat-sous-traitant.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
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
import { contratReducer } from 'src/app/store/contrat/contrat.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ContratEffects } from 'src/app/store/contrat/contrat.effects';
import { ImportContratComponent } from './import-contrat/import-contrat.component';
import { contratClientReducer } from 'src/app/store/contratClient/contratClient.reducer';
import { ContratClientEffects } from 'src/app/store/contratClient/contratClient.effects';



@NgModule({
  declarations: [ContratSousTraitantComponent, ImportContratComponent],
  imports: [
    CommonModule,
    ContratRoutingModule,
    StoreModule.forFeature('contrats',contratReducer),
    StoreModule.forFeature("contratsClient", contratClientReducer),
    EffectsModule.forFeature([ContratEffects]),
    EffectsModule.forFeature([ContratClientEffects]),
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    WidgetModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    ModalModule.forRoot()
  ]
})
export class ContratModule { }
