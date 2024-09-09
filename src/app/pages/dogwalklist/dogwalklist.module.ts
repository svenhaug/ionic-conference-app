import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogwalklistPageRoutingModule } from './dogwalklist-routing.module';

import { DogwalklistPage } from './dogwalklist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogwalklistPageRoutingModule
  ],
  declarations: [DogwalklistPage]
})
export class DogwalklistPageModule {}
