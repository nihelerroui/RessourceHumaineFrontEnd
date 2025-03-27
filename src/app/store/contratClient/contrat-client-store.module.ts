import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ContratClientEffects } from './contratClient.effects';
import { contratClientReducer } from './contratClient.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('contratsClient', contratClientReducer),
    EffectsModule.forFeature([ContratClientEffects])
  ]
})
export class ContratClientStoreModule { }
