import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApartamentoListaComponent } from './apartamento-lista/apartamento-lista.component';
import { ApartamentoCadastroComponent } from './apartamento-cadastro/apartamento-cadastro.component';
import { ApartamentoRoutingModule } from './apartamento-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DefaultService } from '../../services/default.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch';
import { ToastyModule } from 'ng2-toasty';
import { ToastService } from '../../services/toast.service';
import { ApartamentoService } from '../../services/apartamento.service';
import { DataTablesService } from '../../services/data-tables.service';

@NgModule({
  imports: [
    CommonModule,
    ApartamentoRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    UiSwitchModule,
    ToastyModule.forRoot()
  ],
  declarations: [ApartamentoListaComponent, ApartamentoCadastroComponent],
  providers: [
    DefaultService,
    ToastService,
    ApartamentoService,
    DataTablesService
  ]
})
export class ApartamentoModule { }
