import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PetsittingcreatePageRoutingModule } from './petsittingcreate-routing.module';
import { PetsittingcreatePage } from './petsittingcreate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PetsittingcreatePageRoutingModule
  ],
  declarations: [PetsittingcreatePage]
})
export class PetsittingcreatePageModule {}
