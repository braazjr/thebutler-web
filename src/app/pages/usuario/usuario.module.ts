import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { MoradorRoutingModule } from './usuario-routing.module';
import { SharedTheButlerModule } from 'src/app/shared/shared-the-butler.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ModalAlterarSenhaComponent } from 'src/app/shared/components/modal-alterar-senha/modal-alterar-senha.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebCamModule } from 'ack-angular-webcam';

@NgModule({
  imports: [
    CommonModule,
    MoradorRoutingModule,
    SharedModule,
    SharedTheButlerModule,
    WebCamModule,
    ImageCropperModule
  ],
  declarations: [UsuarioListaComponent, UsuarioCadastroComponent],
  entryComponents: [ModalAlterarSenhaComponent]
})
export class UsuarioModule { }
