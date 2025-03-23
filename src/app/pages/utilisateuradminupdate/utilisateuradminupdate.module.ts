import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilisateurAdminUpdateViewComponent } from './utilisateuradminupdateview/utilisateuradminupdateview.component';

@NgModule({
  declarations: [UtilisateurAdminUpdateViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [UtilisateurAdminUpdateViewComponent],
})
export class UtilisateurAdminUpdateModule {}
