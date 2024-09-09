import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DogwalklistPage } from './dogwalklist.page';

const routes: Routes = [
  {
    path: '',
    component: DogwalklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogwalklistPageRoutingModule {}
