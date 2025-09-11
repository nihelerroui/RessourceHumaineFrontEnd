import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoriqueMainOeuvreRoutingModule } from './historique-main-oeuvre-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { historiqueMainOeuvreReducer } from 'src/app/store/historique-mainOeuvre/historiqueMainOeuvre.reducer';
import { EffectsModule } from '@ngrx/effects';
import { HistoriqueMainOeuvreEffects } from 'src/app/store/historique-mainOeuvre/historiqueMainOeuvre.effects';
import { StoreModule } from '@ngrx/store';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { HistoriqueMainOeuvreListComponent } from './historique-main-oeuvre-list/historique-main-oeuvre-list.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    HistoriqueMainOeuvreListComponent
  ],
  imports: [
    
    CommonModule,
    HistoriqueMainOeuvreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('historiqueMainOeuvre', historiqueMainOeuvreReducer),
    EffectsModule.forFeature([HistoriqueMainOeuvreEffects]),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    WidgetModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    ModalModule.forRoot()
  ]
})
export class HistoriqueMainOeuvreModule { }
