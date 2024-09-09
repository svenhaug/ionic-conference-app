import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertcreatePageRoutingModule } from './alertcreate-routing.module';

import { AlertcreatePage } from './alertcreate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AlertcreatePageRoutingModule
  ],
  declarations: [AlertcreatePage]
})
export class AlertcreatePageModule {}
