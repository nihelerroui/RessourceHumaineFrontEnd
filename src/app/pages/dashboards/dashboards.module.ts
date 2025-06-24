import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { NgApexchartsModule } from 'ng-apexcharts';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule, BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SimplebarAngularModule } from 'simplebar-angular';

import { DefaultComponent } from './default/default.component';
import { StoreModule } from '@ngrx/store';
import { factureClientReducer } from 'src/app/store/FactureClient/factureclient.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FactureClientEffects } from 'src/app/store/FactureClient/factureclient.effects';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [DefaultComponent],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule ,
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
    StoreModule.forFeature('factureClient', factureClientReducer),
    EffectsModule.forFeature([FactureClientEffects]),
  ],
  providers: [BsDropdownConfig],
})
export class DashboardsModule { }
