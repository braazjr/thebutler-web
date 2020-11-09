import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassageiroListaComponent } from './passageiro-lista/passageiro-lista.component';
import { PassageiroRoutingModule } from './passageiro-routing.module';
import { PassageiroService } from '../../services/passageiro.service';
import { SharedModule } from '../../theme/shared/shared.module';
import { SharedTheButlerModule } from '../../shared/shared-the-butler.module';
import { PassageiroCadastroComponent } from './passageiro-cadastro/passageiro-cadastro.component';
import { WebCamModule } from 'ack-angular-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { DocumentoService } from '../../services/documento.service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    PassageiroRoutingModule,
    SharedModule,
    SharedTheButlerModule,
    WebCamModule,
    ImageCropperModule,
    FileUploadModule,
    TextMaskModule
  ],
  declarations: [
    PassageiroListaComponent,
    PassageiroCadastroComponent
  ],
  providers: [
    PassageiroService,
    TipoDocumentoService,
    DocumentoService
  ]
})
export class PassageiroModule { }
