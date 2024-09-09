import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategorieslistPageRoutingModule } from './categorieslist-routing.module';

import { CategorieslistPage } from './categorieslist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategorieslistPageRoutingModule
  ],
  declarations: [CategorieslistPage]
})
export class CategorieslistPageModule {}
