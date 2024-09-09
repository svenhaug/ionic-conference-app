import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetsittingdetailPageRoutingModule } from './petsittingdetail-routing.module';

import { PetsittingdetailPage } from './petsittingdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetsittingdetailPageRoutingModule
  ],
  declarations: [PetsittingdetailPage]
})
export class PetsittingdetailPageModule {}
