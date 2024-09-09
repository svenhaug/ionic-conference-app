import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoersedetailPageRoutingModule } from './boersedetail-routing.module';

import { BoersedetailPage } from './boersedetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoersedetailPageRoutingModule
  ],
  declarations: [BoersedetailPage]
})
export class BoersedetailPageModule {}
