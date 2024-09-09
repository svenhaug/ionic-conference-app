import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetsittinglistPageRoutingModule } from './petsittinglist-routing.module';

import { PetsittinglistPage } from './petsittinglist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetsittinglistPageRoutingModule
  ],
  declarations: [PetsittinglistPage]
})
export class PetsittinglistPageModule {}
