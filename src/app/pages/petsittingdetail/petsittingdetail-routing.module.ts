import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetsittingdetailPage } from './petsittingdetail.page';

const routes: Routes = [
  {
    path: '',
    component: PetsittingdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsittingdetailPageRoutingModule {}
