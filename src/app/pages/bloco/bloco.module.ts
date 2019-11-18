import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocoListaComponent } from './bloco-lista/bloco-lista.component';
import { BlocoCadastroComponent } from './bloco-cadastro/bloco-cadastro.component';
import { BlocoRoutingModule } from './bloco-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';

@NgModule({
  imports: [
    CommonModule,
    BlocoRoutingModule,
    SharedModule,
    SharedTheButlerModule
  ],
  declarations: [BlocoListaComponent, BlocoCadastroComponent],
})
export class BlocoModule { }
