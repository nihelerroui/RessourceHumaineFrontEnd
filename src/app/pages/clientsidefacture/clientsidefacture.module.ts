import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ClientViewFactureComponent } from './clientsidefactureview/clientsidefacture.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSliderModule } from 'ngx-slider-v2';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ClientViewFactureComponent
  }
];

@NgModule({
  declarations: [
    ClientViewFactureComponent
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
export class ClientSideFactureModule { }
