import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaCadastroComponent } from './empresa-cadastro/empresa-cadastro.component';
import { EmpresaListaComponent } from './empresa-lista/empresa-lista.component';
import { EmpresaRoutingModule } from './empresa-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';

@NgModule({
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    SharedModule,
    TextMaskModule,
    SharedTheButlerModule
  ],
  declarations: [EmpresaCadastroComponent, EmpresaListaComponent],
})
export class EmpresaModule { }
