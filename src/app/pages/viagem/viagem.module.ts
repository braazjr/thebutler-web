import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViagemListaComponent } from './viagem-lista/viagem-lista.component';
import { ViagemRoutingModule } from './viagem-routing.module';
import { ViagemService } from '../../services/viagem.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';

@NgModule({
  imports: [
    CommonModule,
    ViagemRoutingModule,
    SharedModule,
    SharedTheButlerModule
  ],
  declarations: [ViagemListaComponent],
  providers: [
    ViagemService
  ]
})
export class ViagemModule { }
