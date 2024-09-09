import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertdetailPageRoutingModule } from './alertdetail-routing.module';

import { AlertdetailPage } from './alertdetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertdetailPageRoutingModule
  ],
  declarations: [AlertdetailPage]
})
export class AlertdetailPageModule {}
