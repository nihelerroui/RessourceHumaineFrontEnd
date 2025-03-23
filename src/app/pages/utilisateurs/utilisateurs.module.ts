import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { UtilisateursListComponent } from './utilisateurs-list/utilisateurs-list.component';

const routes: Routes = [
  {
    path: '',
    component: UtilisateursListComponent
  }
];

@NgModule({
  declarations: [UtilisateursListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SharedModule
  ]
})
export class UtilisateursModule { }
