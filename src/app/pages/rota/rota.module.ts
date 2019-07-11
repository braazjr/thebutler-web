import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RotaListaComponent } from './rota-lista/rota-lista.component';
import { RotaCadastroComponent } from './rota-cadastro/rota-cadastro.component';
import { RotaRoutingModule } from './rota-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch';
import { ToastyModule } from 'ng2-toasty';
import { DefaultService } from '../../services/default.service';
import { ToastService } from '../../services/toast.service';

@NgModule({
  imports: [
    CommonModule,
    RotaRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    ToastyModule.forRoot()
  ],
  declarations: [RotaListaComponent, RotaCadastroComponent],
  providers: [
    DefaultService,
    ToastService
  ]
})
export class RotaModule { }
