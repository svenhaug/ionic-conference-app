import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetsittingcreatePage } from './petsittingcreate.page';

const routes: Routes = [
  {
    path: '',
    component: PetsittingcreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsittingcreatePageRoutingModule {}
