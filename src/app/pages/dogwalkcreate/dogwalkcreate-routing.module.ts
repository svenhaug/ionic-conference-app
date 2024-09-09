import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DogwalkcreatePage } from './dogwalkcreate.page';

const routes: Routes = [
  {
    path: '',
    component: DogwalkcreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogwalkcreatePageRoutingModule {}
