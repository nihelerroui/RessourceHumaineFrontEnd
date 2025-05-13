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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FactureClientEffects } from 'src/app/store/FactureClient/factureclient.effects';
import { factureClientReducer } from 'src/app/store/FactureClient/factureclient.reducer';
import { UIModule } from 'src/app/shared/ui/ui.module';

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
    UIModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,  
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    StoreModule.forFeature('factureClient', factureClientReducer),
    EffectsModule.forFeature([FactureClientEffects]),
  ],
  providers: [FactureClientService],
  exports: [FactureClientListComponent]
})
export class FactureClientModule { }
