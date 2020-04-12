// import { FileUploadModule } from 'ng2-file-upload';
import { DocumentoService } from './../../services/documento.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FichaCadastroComponent } from './ficha-cadastro/ficha-cadastro.component';
import { FichaRoutingModule } from './ficha-routing.module';
import { BlocoService } from '../../services/bloco.service';
import { ApartamentoService } from '../../services/apartamento.service';
import { TextMaskModule } from 'angular2-text-mask';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { TipoMoradorService } from '../../services/tipo-morador.service';
import { ToastService } from '../../services/toast.service';
import { WebCamModule } from 'ack-angular-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DataTablesService } from '../../services/data-tables.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { FichaListaComponent } from './ficha-lista/ficha-lista.component';

@NgModule({
  imports: [
    CommonModule,
    FichaRoutingModule,
    SharedModule,
    SharedTheButlerModule,
    TextMaskModule,
    WebCamModule,
    ImageCropperModule,
    // FileUploadModule
    FileUploadModule
  ],
  declarations: [FichaCadastroComponent, FichaListaComponent],
  providers: [
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
