import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PrestationListComponent } from './prestation-list/prestation-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSliderModule } from 'ngx-slider-v2'; 
import { SharedModule } from '../../shared/shared.module';
import { PrestationEffects } from 'src/app/store/Prestation/prestation.effects';
import { prestationReducer } from 'src/app/store/Prestation/prestation.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

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
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgxSliderModule,
    StoreModule.forFeature('prestations', prestationReducer),
    EffectsModule.forFeature([PrestationEffects]),
  ]
})
export class PrestationsModule { }