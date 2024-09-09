import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogwalkdetailPageRoutingModule } from './dogwalkdetail-routing.module';

import { DogwalkdetailPage } from './dogwalkdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogwalkdetailPageRoutingModule
  ],
  declarations: [DogwalkdetailPage]
})
export class DogwalkdetailPageModule {}
