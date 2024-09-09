import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoerselistPage } from './boerselist.page';

const routes: Routes = [
  {
    path: '',
    component: BoerselistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoerselistPageRoutingModule {}
