import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DepenseListComponent } from './depense-list/depense-list.component';
import { DepenseService } from '../../core/services/depense.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DepenseListComponent
  }
];

@NgModule({
  declarations: [
    DepenseListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,  // Shared module included
    BsDatepickerModule.forRoot(),
  ],
  providers: [DepenseService],
  exports: [DepenseListComponent]
})
export class DepensesModule { }
