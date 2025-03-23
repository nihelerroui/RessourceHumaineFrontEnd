import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { UtilisateurregisterviewComponent } from './utilisateurregisterview/utilisateurregisterview.component';

@NgModule({
  declarations: [
    UtilisateurregisterviewComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  exports: [
    UtilisateurregisterviewComponent
  ],
  providers: [
    BsModalService
  ]
})
export class UtilisateurregisterModule { }
