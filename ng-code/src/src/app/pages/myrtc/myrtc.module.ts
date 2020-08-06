import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyrtcRoutingModule } from './myrtc-routing.module';
import { MyrtcComponent } from './myrtc.component';


@NgModule({
  declarations: [MyrtcComponent],
  imports: [
    CommonModule,
    MyrtcRoutingModule
  ]
 
})
export class MyrtcModule { }
