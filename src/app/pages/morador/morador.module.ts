import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoradorListaComponent } from './morador-lista/morador-lista.component';
import { MoradorRoutingModule } from './morador-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MoradorService } from '../../services/morador.service';
import { SelectModule } from 'ng-select';
import { FormsModule } from '@angular/forms';
import { DefaultService } from '../../services/default.service';

@NgModule({
  imports: [
    CommonModule,
    MoradorRoutingModule,
    SharedModule,
    NgxDatatableModule,
    SelectModule,
    FormsModule
  ],
  declarations: [MoradorListaComponent],
  providers: [
    MoradorService,
    DefaultService
  ]
})
export class MoradorModule { }
