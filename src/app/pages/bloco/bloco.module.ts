import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocoListaComponent } from './bloco-lista/bloco-lista.component';
import { BlocoCadastroComponent } from './bloco-cadastro/bloco-cadastro.component';
import { BlocoRoutingModule } from './bloco-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DefaultService } from '../../services/default.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch';
import { ToastyModule } from 'ng2-toasty';
import { ToastService } from '../../services/toast.service';
import { BlocoService } from 'src/app/services/bloco.service';

@NgModule({
  imports: [
    CommonModule,
    BlocoRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    UiSwitchModule,
    ToastyModule.forRoot()
  ],
  declarations: [BlocoListaComponent, BlocoCadastroComponent],
  providers: [
    DefaultService,
    ToastService,
    BlocoService
  ]
})
export class BlocoModule { }
