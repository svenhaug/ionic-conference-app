import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertcreatePage } from './alertcreate.page';

const routes: Routes = [
  {
    path: '',
    component: AlertcreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertcreatePageRoutingModule {}
