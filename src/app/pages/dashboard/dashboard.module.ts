import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';



@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    SharedTheButlerModule
  ]
})
export class DashboardModule { }
