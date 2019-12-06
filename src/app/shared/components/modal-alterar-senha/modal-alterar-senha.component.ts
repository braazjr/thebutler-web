import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'modal-alterar-senha',
  templateUrl: './modal-alterar-senha.component.html',
  styleUrls: ['./modal-alterar-senha.component.scss']
})
export class ModalAlterarSenhaComponent implements OnInit {

  @Input() usuario: Usuario = new Usuario();

  formularioSenha: FormGroup;

  @ViewChild('modalRedefinirSenha', { static: false }) modalRedefinirSenha: any;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.formularioSenha = this.formBuilder.group({
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })
  }

  public show(): void {
    this.modalRedefinirSenha.show();
  }

  public hide(): void {
    this.modalRedefinirSenha.hide();
  }

  senhaValidator() {
    return this.formularioSenha.get('senha').value === this.formularioSenha.get('confirmaSenha').value ? true : false;
  }

  isValidSenha(field) {
    return this.formularioSenha.get(field).status === 'VALID' ? true : false;
  }

  redefinirSenha(modal) {
    this.usuarioService.redefinirSenha(this.usuario.id, this.usuario.senha, this.formularioSenha.get('confirmaSenha').value)
      .subscribe(() => {
        this.usuario.senha = this.formularioSenha.get('confirmaSenha').value;
        this.toastService.addToast('success', 'Redefinição de senha!', `Senha redefinida com sucesso!`);
      }, () => {
        modal.hide();
      });
  }

}
