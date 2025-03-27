import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ImportContratComponent } from '../pages/contrat/import-contrat/import-contrat.component';
import { ContratsClientListComponent } from '../pages/contrat/contrats-client-list/contrats-client-list.component';
import { CommentContratModalComponent } from '../pages/contrat/comment-contrat-modal/comment-contrat-modal.component';
import { UIModule } from '../shared/ui/ui.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { contratClientReducer } from '../store/contratClient/contratClient.reducer';
import { commentaireContratReducer } from '../store/commentaire-contrat/commentaire-contrat.reducer';
import { ContratClientEffects } from '../store/contratClient/contratClient.effects';
import { CommentaireContratEffects } from '../store/commentaire-contrat/commentaire-contrat.effects';

@NgModule({
  declarations: [
    ImportContratComponent,
    ContratsClientListComponent,
    CommentContratModalComponent,
  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    UIModule,
    
  ],
  exports: [
    ImportContratComponent,
    ContratsClientListComponent,
    CommentContratModalComponent
  ]
})
export class SharedContratModule {}
