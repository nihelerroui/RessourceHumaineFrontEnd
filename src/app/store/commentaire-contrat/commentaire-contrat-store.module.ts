import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { commentaireContratReducer } from './commentaire-contrat.reducer';
import { CommentaireContratEffects } from './commentaire-contrat.effects';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('commentaireContrat', commentaireContratReducer),
    EffectsModule.forFeature([CommentaireContratEffects])
  ]
})
export class CommentaireContratStoreModule { }
