import { Empresa } from './../../../models/empresa-model';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Usuario } from '../../../models/usuario-model';
import { IOption } from 'ng-select';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { SharedService } from '../../../services/shared.service';
import { ToastService } from '../../../services/toast.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-cadastro',
  templateUrl: './usuario-cadastro.component.html',
  styleUrls: ['./usuario-cadastro.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class UsuarioCadastroComponent implements OnInit, AfterViewChecked {

  observable: any;

  usuario: Usuario = new Usuario();
  listaPermissoes: Array<IOption> = [];
  listaEmpresas: Array<IOption> = [];
  permissoes: any[] = [];
  permissaoIds: any[] = [];
  empresaId: string;

  formulario: FormGroup;
  formularioSenha: FormGroup;

  constructor(private route: ActivatedRoute, private defaultService: DefaultService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, private sharedService: SharedService, private toastService: ToastService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.usuario.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      empresa: ['', [Validators.required]],
      permissao: ['', [Validators.required]],
      primeiroNome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      ultimoNome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      ativo: ['', [Validators.required]],
      login: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
      // senha: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]]
    });

    this.formularioSenha = this.formBuilder.group({
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })
  }

  senhaValidator() {
    return this.usuario.senhaNova === this.usuario.confirmaSenha ? true : false;
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('usuarios', this.usuario.id).subscribe(response => {
      this.usuario = response as Usuario;
      if (this.usuario.empresa) {
        this.empresaId = this.usuario.empresa.id.toString();
      }
      // this.condominioId = this.bloco.condominio.id.toString();
      this.carregarPermissoes();
      this.carregarEmpresas();
    });
  }

  carregarPermissoes() {
    this.defaultService.get('permissoes').subscribe(response => {
      this.permissoes = response as any[];
      this.listaPermissoes = (response as any[]).map(perm => {
        if (this.usuario.id && this.usuario.permissoes.map(permissao => permissao.codigo).includes(perm.codigo)) {
          this.permissaoIds.push(perm.codigo.toString());
          this.formulario.get('permissao').setErrors(null);
        }

        return ({ value: perm.codigo.toString(), label: perm.descricao });
      });
    }, error => console.error(error));
  }

  carregarEmpresas() {
    this.defaultService.get('empresas').subscribe(response => {
      this.listaEmpresas = (response as Empresa[]).map(emp => {
        if (this.usuario.id && this.usuario.empresa && emp.id === this.usuario.empresa.id) {
          return ({ value: emp.id.toString(), label: emp.nomeFantasia, disabled: false });
        }

        return ({ value: emp.id.toString(), label: emp.nomeFantasia, disabled: false });
      });
    });
  }

  isValid(field) {
    return this.formulario.get(field).status === 'VALID' ? true : false;
  }

  isValidSenha(field) {
    return this.formularioSenha.get(field).status === 'VALID' ? true : false;
  }

  salvar(modal?) {
    if (this.formulario.invalid) {
      swal('Cadastro de usuário', 'Não é possível salvar o usuário!<br>Existem campos inválidos', 'error');
    } else {
      // this.usuario.usuario = this.sharedService.getUsuarioLogged();
      this.usuario.permissoes = this.permissoes.filter(permissao => this.permissaoIds.includes(permissao.codigo.toString()));
      this.usuario.empresa.id = Number(this.empresaId);

      if (!this.usuario.id) {
        this.observable = this.defaultService.salvar('usuarios', this.usuario).subscribe(response => {
          this.usuario = response as Usuario;
          this.toastService.addToast('success', 'Cadastro Usuário!', `Usuário ${this.usuario.primeiroNome} ${this.usuario.ultimoNome} salvo com sucesso!`);

          if (modal)
            modal.hide();
        }, error => {
          console.error(error);
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Usuário!', element.mensagemUsuario);
          });
        });
      } else {
        if (this.usuario.senhaNova)
          this.usuario.senha = this.usuario.senhaNova;
        this.observable = this.defaultService.atualizar('usuarios', this.usuario).subscribe(response => {
          this.usuario = response as Usuario;
          this.toastService.addToast('success', 'Atualização Usuário!', `Usuário ${this.usuario.primeiroNome} ${this.usuario.ultimoNome} atualizado com sucesso!`);

          if (modal)
            modal.hide();
        }, error => {
          console.error(error);
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Usuário!', element.mensagemUsuario);
          });
        });
      }
    }
  }

  modalClose(modal) {
    modal.hide();
    this.usuario.senhaNova = undefined;
    this.usuario.confirmaSenha = undefined
  }
}
