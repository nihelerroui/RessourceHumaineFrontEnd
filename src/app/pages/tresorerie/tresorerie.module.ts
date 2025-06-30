import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TresorerieRoutingModule } from "./tresorerie-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { UIModule } from "src/app/shared/ui/ui.module";
import { TresorerieComponent } from "./tresorerie/tresorerie.component";

@NgModule({
  declarations: [
    TresorerieComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    TresorerieRoutingModule,
  ],
})
export class TresorerieModule {}
