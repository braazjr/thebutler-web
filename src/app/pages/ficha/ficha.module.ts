import { FileUploadModule } from 'ng2-file-upload';
import { DocumentoService } from './../../services/documento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FichaCadastroComponent } from './ficha-cadastro/ficha-cadastro.component';
import { FichaRoutingModule } from './ficha-routing.module';
import { DefaultService } from '../../services/default.service';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { BlocoService } from '../../services/bloco.service';
import { ApartamentoService } from '../../services/apartamento.service';
import { TextMaskModule } from 'angular2-text-mask';
import { UiSwitchModule } from 'ng2-ui-switch';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { TipoMoradorService } from '../../services/tipo-morador.service';
import { ToastyModule } from 'ng2-toasty';
import { ToastService } from '../../services/toast.service';
import { WebCamModule } from 'ack-angular-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DataTablesService } from '../../services/data-tables.service';

@NgModule({
  imports: [
    CommonModule,
    FichaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    TextMaskModule,
    UiSwitchModule,
    ToastyModule.forRoot(),
    WebCamModule,
    ImageCropperModule,
    FileUploadModule
  ],
  declarations: [FichaCadastroComponent],
  providers: [
    DefaultService,
    BlocoService,
    ApartamentoService,
    TipoDocumentoService,
    TipoMoradorService,
    ToastService,
    DocumentoService,
    DataTablesService
  ]
})
export class FichaModule { }
