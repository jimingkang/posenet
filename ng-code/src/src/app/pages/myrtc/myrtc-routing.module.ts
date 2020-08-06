import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyrtcComponent } from './myrtc.component';


const routes: Routes = [
  {
    path: 'myrtc/:id', component: MyrtcComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyrtcRoutingModule { }
