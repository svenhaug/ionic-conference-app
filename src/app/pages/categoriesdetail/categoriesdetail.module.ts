import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesdetailPageRoutingModule } from './categoriesdetail-routing.module';

import { CategoriesdetailPage } from './categoriesdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesdetailPageRoutingModule
  ],
  declarations: [CategoriesdetailPage]
})
export class CategoriesdetailPageModule {}
