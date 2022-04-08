import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdicionPageRoutingModule } from './edicion-routing.module';

import { EdicionPage } from './edicion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EdicionPageRoutingModule
  ],
  declarations: [EdicionPage]
})
export class EdicionPageModule {}
