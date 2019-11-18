import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSigninV2RoutingModule } from './auth-signin-v2-routing.module';
import { AuthSigninV2Component } from './auth-signin-v2.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';

@NgModule({
  declarations: [AuthSigninV2Component],
  imports: [
    CommonModule,
    AuthSigninV2RoutingModule,
    SharedModule,
    SharedTheButlerModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthSigninV2Module { }
