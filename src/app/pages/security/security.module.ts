import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityGuard } from './security.guard';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [SecurityGuard]
})
export class SecurityModule { }
