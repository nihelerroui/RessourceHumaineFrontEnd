import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSliderModule } from 'ngx-slider-v2';
import { chiffreAffaireReducer } from 'src/app/store/ChiffreAffaire/ChiffreAffaire.reducer';
import { ChiffreAffaireEffects } from 'src/app/store/ChiffreAffaire/ChiffreAffaire.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HistoriqueChiffreAffaireComponent } from './historiqueChiffreAffaire/historiqueChiffreAffaire.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgApexchartsModule } from 'ng-apexcharts';


const routes: Routes = [
  {
    path: '',
    component: HistoriqueChiffreAffaireComponent
  }
];
@NgModule({
  declarations: [
    HistoriqueChiffreAffaireComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgxSliderModule,
    StoreModule.forFeature('chiffreAffaire', chiffreAffaireReducer),
    EffectsModule.forFeature([ChiffreAffaireEffects]),
  ]
})
export class HistoriqueChiffreAffaireModule { }
