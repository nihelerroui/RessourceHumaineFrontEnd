import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "src/app/shared/ui/ui.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { SharedModule } from "src/app/shared/shared.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxSliderModule } from "ngx-slider-v2";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { CommentContratSTComponent } from "./comment-contratST-list/comment-contratST.component";
import { commentaireContratSousTraitantReducer } from "src/app/store/commentaire-contratSousTraitant/commentaire-contratSousTraitant.reducer";
import { CommentaireContratSousTraitantEffects } from "src/app/store/commentaire-contratSousTraitant/commentaire-contratSousTraitant.effects";
const routes: Routes = [
  {
    path: '',
    component: CommentContratSTComponent
  }
];
@NgModule({
  declarations: [
    CommentContratSTComponent
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
    NgxSliderModule,
    StoreModule.forFeature('commentaireContratSousTraitant', commentaireContratSousTraitantReducer),
    EffectsModule.forFeature([CommentaireContratSousTraitantEffects])
  ]
})
export class CommentaireContratSousTraitantModule { }