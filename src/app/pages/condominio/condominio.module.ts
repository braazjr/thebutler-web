import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CondominioListaComponent } from './condominio-lista/condominio-lista.component';
import { CondominioCadastroComponent } from './condominio-cadastro/condominio-cadastro.component';
import { CondominioRoutingModule } from './condominio-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    CondominioRoutingModule,
    SharedModule,
    SharedTheButlerModule,
    TextMaskModule
  ],
  declarations: [CondominioListaComponent, CondominioCadastroComponent],
})
export class CondominioModule { }
