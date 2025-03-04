// src/app/pages/prestations/prestations.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PrestationListComponent } from './prestation-list/prestation-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Import the shared module that contains the page-title component
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PrestationListComponent
  }
];

@NgModule({
  declarations: [
    PrestationListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule ,
    BsDatepickerModule.forRoot(), // Add this line
    // Add the shared module here
  ]
})
export class PrestationsModule { }