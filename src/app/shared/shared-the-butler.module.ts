import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultService } from '../services/default.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedService } from 'src/app/shared/shared.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { SelectModule } from 'ng-select';
import { ToastService } from '../services/toast.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ValidFormDirectiveDirective } from './directives/valid-form-directive.directive';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalAlterarSenhaComponent } from './components/modal-alterar-senha/modal-alterar-senha.component';
import { ModalModule } from '../theme/shared/components';

@NgModule({
  declarations: [ValidFormDirectiveDirective, ModalAlterarSenhaComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    SelectModule,
    NgxSpinnerModule,
    NgbCollapseModule,
    ModalModule
  ],
  providers: [
    DefaultService,
    UsuarioService,
    SharedService,
    ToastService
  ],
  exports: [
    ToastyModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SelectModule,
    NgxSpinnerModule,
    ValidFormDirectiveDirective,
    NgbCollapseModule,
    ModalAlterarSenhaComponent
  ]
})
export class SharedTheButlerModule { }
