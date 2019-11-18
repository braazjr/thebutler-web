import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { MoradorRoutingModule } from './usuario-routing.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MoradorRoutingModule,
    SharedModule,
    SharedTheButlerModule
  ],
  declarations: [UsuarioListaComponent, UsuarioCadastroComponent],
})
export class UsuarioModule { }
