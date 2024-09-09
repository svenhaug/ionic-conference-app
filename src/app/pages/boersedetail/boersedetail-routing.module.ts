import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoersedetailPage } from './boersedetail.page';


const routes: Routes = [
  {
    path: '',
    component: BoersedetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoersedetailPageRoutingModule {}
