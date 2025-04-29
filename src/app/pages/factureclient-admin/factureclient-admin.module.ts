import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FactureclientAdminComponent } from './factureclient-list/factureclient-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSliderModule } from 'ngx-slider-v2';


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
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgxSliderModule
  ]
})
export class FactureclientAdminModule { }
