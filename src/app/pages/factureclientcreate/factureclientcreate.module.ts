import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FactureClientCreateComponent } from './factureclientcreateview/factureclientcreate.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSliderModule } from 'ngx-slider-v2';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: FactureClientCreateComponent
  }
];

@NgModule({
  declarations: [
    FactureClientCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgxSliderModule,
    NgSelectModule
  ]
})
export class FactureClientCreateModule { }
