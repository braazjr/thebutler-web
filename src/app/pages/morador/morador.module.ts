import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoradorListaComponent } from './morador-lista/morador-lista.component';
import { MoradorRoutingModule } from './morador-routing.module';
import { MoradorService } from '../../services/morador.service';
import { SharedModule } from '../../theme/shared/shared.module';
import { SharedTheButlerModule } from '../../shared/shared-the-butler.module';
import { MoradorCadastroComponent } from './morador-cadastro/morador-cadastro.component';
import { WebCamModule } from 'ack-angular-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { TipoMoradorService } from '../../services/tipo-morador.service';
import { DocumentoService } from '../../services/documento.service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    MoradorRoutingModule,
    SharedModule,
    SharedTheButlerModule,
    WebCamModule,
    ImageCropperModule,
    FileUploadModule,
    TextMaskModule
  ],
  declarations: [
    MoradorListaComponent,
    MoradorCadastroComponent
  ],
  providers: [
    MoradorService,
    TipoDocumentoService,
    TipoMoradorService,
    DocumentoService
  ]
})
export class MoradorModule { }
