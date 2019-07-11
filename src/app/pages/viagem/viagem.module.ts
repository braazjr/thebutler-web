import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViagemListaComponent } from './viagem-lista/viagem-lista.component';
import { ViagemRoutingModule } from './viagem-routing.module';
import { ViagemService } from '../../services/viagem.service';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    ViagemRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [ViagemListaComponent],
  providers: [
    ViagemService
  ]
})
export class ViagemModule { }
