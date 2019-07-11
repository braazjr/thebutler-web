import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CondominioListaComponent } from './condominio-lista/condominio-lista.component';
import { CondominioCadastroComponent } from './condominio-cadastro/condominio-cadastro.component';
import { CondominioRoutingModule } from './condominio-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DefaultService } from '../../services/default.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { UiSwitchModule } from 'ng2-ui-switch';
import { ToastyModule } from 'ng2-toasty';
import { ToastService } from '../../services/toast.service';

@NgModule({
  imports: [
    CommonModule,
    CondominioRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    TextMaskModule,
    UiSwitchModule,
    ToastyModule
  ],
  declarations: [CondominioListaComponent, CondominioCadastroComponent],
  providers: [
    DefaultService,
    ToastService
  ]
})
export class CondominioModule { }
