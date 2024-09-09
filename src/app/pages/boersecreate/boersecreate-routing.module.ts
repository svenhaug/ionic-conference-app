import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoersecreatePage } from './boersecreate.page';

const routes: Routes = [
  {
    path: '',
    component: BoersecreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoersecreatePageRoutingModule {}
