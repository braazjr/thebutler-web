import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoradorListaComponent } from './morador-lista/morador-lista.component';
import { MoradorRoutingModule } from './morador-routing.module';
import { MoradorService } from '../../services/morador.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';

@NgModule({
  imports: [
    CommonModule,
    MoradorRoutingModule,
    SharedModule,
    SharedTheButlerModule
  ],
  declarations: [MoradorListaComponent],
  providers: [
    MoradorService,
  ]
})
export class MoradorModule { }
