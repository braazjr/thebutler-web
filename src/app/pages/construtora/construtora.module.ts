import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstrutoraListaComponent } from './construtora-lista/construtora-lista.component';
import { ConstrutoraCadastroComponent } from './construtora-cadastro/construtora-cadastro.component';
import { ConstrutoraRoutingModule } from './construtora-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';

@NgModule({
  imports: [
    CommonModule,
    ConstrutoraRoutingModule,
    SharedModule,
    TextMaskModule,
    SharedTheButlerModule
  ],
  declarations: [ConstrutoraListaComponent, ConstrutoraCadastroComponent],
})
export class ConstrutoraModule { }
