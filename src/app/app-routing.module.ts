import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./core/guards/auth.guard";
import { LayoutComponent } from "./layouts/layout.component";
import { CyptolandingComponent } from "./cyptolanding/cyptolanding.component";
import { Page404Component } from "./extrapages/page404/page404.component";
import { ImportContratComponent } from "./pages/ImportationContrat/import-contrat/import-contrat.component";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "",
    component: LayoutComponent,
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule),
    canActivate: [AuthGuard],
  },
  { path: "crypto-ico-landing", component: CyptolandingComponent },
  {
    path: "import-contrat",
    component: ImportContratComponent
  },
  { path: 'tresorerie', loadChildren: () => import('./pages/tresorerie/tresorerie.module').then(m => m.TresorerieModule) },
  { path: 'tresorerie', loadChildren: () => import('./pages/tresorerie/tresorerie.module').then(m => m.TresorerieModule) },
  { path: 'token-expire', component: Page404Component },
  { path: "**", component: Page404Component },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
