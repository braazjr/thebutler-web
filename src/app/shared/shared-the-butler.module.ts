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

@NgModule({
  declarations: [ValidFormDirectiveDirective],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    SelectModule,
    NgxSpinnerModule,
    NgbCollapseModule
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
    NgbCollapseModule
  ]
})
export class SharedTheButlerModule { }
