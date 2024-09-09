import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DogwalkcreatePageRoutingModule } from './dogwalkcreate-routing.module';
import { DogwalkcreatePage } from './dogwalkcreate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DogwalkcreatePageRoutingModule
  ],
  declarations: [DogwalkcreatePage]
})
export class DogwalkcreatePageModule {}
