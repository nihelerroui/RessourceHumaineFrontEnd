import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FactureclientAdminComponent } from './factureclient-list/factureclient-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSliderModule } from 'ngx-slider-v2';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { factureClientReducer } from 'src/app/store/FactureClient/factureclient.reducer';
import { FactureClientEffects } from 'src/app/store/FactureClient/factureclient.effects';


const routes: Routes = [
  {
    path: '',
    component: FactureclientAdminComponent
  }
];
@NgModule({
  declarations: [
    FactureclientAdminComponent
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
    StoreModule.forFeature('factureClient', factureClientReducer),
    EffectsModule.forFeature([FactureClientEffects]),
  ]
})
export class FactureclientAdminModule { }
