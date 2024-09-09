import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertdetailPage } from './alertdetail.page';

const routes: Routes = [
  {
    path: '',
    component: AlertdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertdetailPageRoutingModule {}
