import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MenuItems } from './shared/menu-items/menu-items';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { RouteGuard } from './pages/auth/auth.route.guard';
import { AuthService } from './services/auth.service';
import { UsuarioService } from './services/usuario.service';
import { SharedService } from './services/shared.service';
import { LetsencryptComponent } from './test/letsencrypt/letsencrypt.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    BreadcrumbsComponent,
    LetsencryptComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    MenuItems,
    RouteGuard,
    AuthService,
    UsuarioService,
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
