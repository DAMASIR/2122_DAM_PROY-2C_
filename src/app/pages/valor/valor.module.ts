import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValorPageRoutingModule } from './valor-routing.module';

import { ValorPage } from './valor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ValorPageRoutingModule
  ],
  declarations: [ValorPage]
})
export class ValorPageModule {}
