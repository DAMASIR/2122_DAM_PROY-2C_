import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdicionPage } from './edicion.page';

const routes: Routes = [
  {
    path: '',
    component: EdicionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdicionPageRoutingModule {}
