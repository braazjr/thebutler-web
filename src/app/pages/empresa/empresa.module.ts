import { EmpresaRouteGuard } from './empresa.route.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaCadastroComponent } from './empresa-cadastro/empresa-cadastro.component';
import { EmpresaListaComponent } from './empresa-lista/empresa-lista.component';
import { EmpresaRoutingModule } from './empresa-routing.module';
import { DefaultService } from '../../services/default.service';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { UiSwitchModule } from 'ng2-ui-switch';
import { ToastyModule } from 'ng2-toasty';
import { ToastService } from '../../services/toast.service';

@NgModule({
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    UiSwitchModule,
    ToastyModule.forRoot()
  ],
  declarations: [EmpresaCadastroComponent, EmpresaListaComponent],
  providers: [
    DefaultService,
    ToastService,
    EmpresaRouteGuard
  ]
})
export class EmpresaModule { }
