import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { caisseReducer } from 'src/app/store/caisse/caisse.reducer';
import { CaisseEffects } from 'src/app/store/caisse/caisse.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { TresorieComponent } from './tresorie/tresorie.component';
import { CaisseRoutingModule } from './caisse-routing.module';
import { depenseReducer } from 'src/app/store/Depense/depense.reducer';
import { recetteReducer } from 'src/app/store/recette/recette.reducer';
import { DepenseEffects } from 'src/app/store/Depense/depense.effects';
import { RecetteEffects } from 'src/app/store/recette/recette.effects';



@NgModule({
  declarations: [
    TresorieComponent

  ],
  imports: [
    CommonModule,
    CaisseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('caisse', caisseReducer),
    EffectsModule.forFeature([CaisseEffects]),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    StoreModule.forFeature('depense', depenseReducer),
    StoreModule.forFeature('recettes', recetteReducer),
    EffectsModule.forFeature([DepenseEffects]),
    EffectsModule.forFeature([RecetteEffects]),


  ]
})
export class CaisseModule { }
