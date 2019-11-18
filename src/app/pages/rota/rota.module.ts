import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RotaListaComponent } from './rota-lista/rota-lista.component';
import { RotaCadastroComponent } from './rota-cadastro/rota-cadastro.component';
import { RotaRoutingModule } from './rota-routing.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RotaRoutingModule,
    SharedModule,
    SharedTheButlerModule
  ],
  declarations: [RotaListaComponent, RotaCadastroComponent],
})
export class RotaModule { }
