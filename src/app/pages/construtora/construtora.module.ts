import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstrutoraListaComponent } from './construtora-lista/construtora-lista.component';
import { ConstrutoraCadastroComponent } from './construtora-cadastro/construtora-cadastro.component';
import { ConstrutoraRoutingModule } from './construtora-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DefaultService } from '../../services/default.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SelectModule } from 'ng-select';
import { ToastyModule } from 'ng2-toasty';
import { ToastService } from '../../services/toast.service';

@NgModule({
  imports: [
    CommonModule,
    ConstrutoraRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    UiSwitchModule,
    SelectModule,
    ToastyModule.forRoot()
  ],
  declarations: [ConstrutoraListaComponent, ConstrutoraCadastroComponent],
  providers: [
    DefaultService,
    ToastService
  ]
})
export class ConstrutoraModule { }
