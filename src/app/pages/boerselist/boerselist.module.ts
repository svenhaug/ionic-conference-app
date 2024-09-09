import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoerselistPageRoutingModule } from './boerselist-routing.module';

import { BoerselistPage } from './boerselist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoerselistPageRoutingModule
  ],
  declarations: [BoerselistPage]
})
export class BoerselistPageModule {}
