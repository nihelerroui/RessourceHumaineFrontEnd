import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommentContratComponent } from "./comment-contrat-list/comment-contrat.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "src/app/shared/ui/ui.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { SharedModule } from "src/app/shared/shared.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxSliderModule } from "ngx-slider-v2";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { commentaireContratClientReducer } from "src/app/store/commentaire-contratClient/commentaire-contratClient.reducer";
import { CommentaireContratClientEffects } from "src/app/store/commentaire-contratClient/commentaire-contratClient.effects";

const routes: Routes = [
  {
    path: '',
    component: CommentContratComponent
  }
];
@NgModule({
  declarations: [
    CommentContratComponent
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
    StoreModule.forFeature('commentaireContratClient', commentaireContratClientReducer),
    EffectsModule.forFeature([CommentaireContratClientEffects])
    
  ]
})
export class CommentaireContratModule { }