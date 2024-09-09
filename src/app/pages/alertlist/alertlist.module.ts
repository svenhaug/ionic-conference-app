import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertlistPageRoutingModule } from './alertlist-routing.module';

import { AlertlistPage } from './alertlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertlistPageRoutingModule
  ],
  declarations: [AlertlistPage]
})
export class AlertlistPageModule {}
