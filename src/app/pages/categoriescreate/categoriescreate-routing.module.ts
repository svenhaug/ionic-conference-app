import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriescreatePage } from './categoriescreate.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriescreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriescreatePageRoutingModule {}
