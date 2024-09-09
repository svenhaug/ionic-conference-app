import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategorieslistPage } from './categorieslist.page';

const routes: Routes = [
  {
    path: '',
    component: CategorieslistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategorieslistPageRoutingModule {}
