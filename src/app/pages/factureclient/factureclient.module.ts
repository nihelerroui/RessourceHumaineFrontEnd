import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FactureClientListComponent } from './factureclient-list/factureclient-list.component';
import { FactureClientService } from '../../core/services/factureclient.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: FactureClientListComponent
  }
];

@NgModule({
  declarations: [
    FactureClientListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,  // Shared module included
    BsDatepickerModule.forRoot(),
    NgSelectModule
  ],
  providers: [FactureClientService],
  exports: [FactureClientListComponent]
})
export class FactureClientModule { }
