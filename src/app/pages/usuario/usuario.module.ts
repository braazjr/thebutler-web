import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { MoradorRoutingModule } from './usuario-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastyModule } from 'ng2-toasty';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SelectModule } from 'ng-select';
import { DefaultService } from '../../services/default.service';
import { ToastService } from '../../services/toast.service';

@NgModule({
  imports: [
    CommonModule,
    MoradorRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    UiSwitchModule,
    ToastyModule.forRoot()
  ],
  declarations: [UsuarioListaComponent, UsuarioCadastroComponent],
  providers: [
    DefaultService,
    ToastService
  ]
})
export class UsuarioModule { }
