import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApartamentoListaComponent } from './apartamento-lista/apartamento-lista.component';
import { ApartamentoCadastroComponent } from './apartamento-cadastro/apartamento-cadastro.component';
import { ApartamentoRoutingModule } from './apartamento-routing.module';
import { ApartamentoService } from '../../services/apartamento.service';
import { DataTablesService } from '../../services/data-tables.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';

@NgModule({
  imports: [
    CommonModule,
    ApartamentoRoutingModule,
    SharedModule,
    SharedTheButlerModule
  ],
  declarations: [ApartamentoListaComponent, ApartamentoCadastroComponent],
  providers: [
    ApartamentoService,
    DataTablesService
  ]
})
export class ApartamentoModule { }
