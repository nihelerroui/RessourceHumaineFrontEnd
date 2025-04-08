import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DepenseListComponent } from './depense-list/depense-list.component';
import { DepenseService } from 'src/app/core/services/depense.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { depenseReducer } from 'src/app/store/Depense/depense.reducer';
import { DepenseEffects } from 'src/app/store/Depense/depense.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [
  {
    path: '', component: DepenseListComponent
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
    StoreModule.forFeature('depense', depenseReducer),
    EffectsModule.forFeature([DepenseEffects]),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    UIModule
  ],
  providers: [DepenseService],
  exports: [DepenseListComponent]
})
export class DepensesModule { }
