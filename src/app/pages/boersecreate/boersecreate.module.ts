import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoersecreatePageRoutingModule } from './boersecreate-routing.module';

import { BoersecreatePage } from './boersecreate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BoersecreatePageRoutingModule
  ],
  declarations: [BoersecreatePage]
})
export class BoersecreatePageModule {}
