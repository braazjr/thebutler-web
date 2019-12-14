import { Empresa } from './../../../models/empresa-model';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Usuario } from '../../../models/usuario-model';
import { IOption } from 'ng-select';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-usuario-cadastro',
  templateUrl: './usuario-cadastro.component.html',
  styleUrls: ['./usuario-cadastro.component.scss']
})
export class UsuarioCadastroComponent implements OnInit, AfterViewChecked {

  usuario: Usuario = new Usuario();
  listaPermissoes: Array<IOption> = [];
  listaEmpresas: Array<IOption> = [];
  permissoes: any[] = [];
  permissaoIds: any[] = [];
  empresaId: string = '0';

  isSubmit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.usuario.id = params['id'];
        this.getById();
      } else {
        this.usuario.ativo = true;
        this.carregarPermissoes();

        if (this.sharedService.isAdmin()) {
          this.carregarEmpresas();
        } else {
          this.empresaId = this.sharedService.getUsuarioLogged().empresa.id.toString();
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('usuarios', this.usuario.id)
      .subscribe(response => {
        this.usuario = response as Usuario;
        if (this.usuario.empresa) {
          this.empresaId = this.usuario.empresa.id.toString();
        }

        this.carregarPermissoes();
        this.carregarEmpresas();
      });
  }

  carregarPermissoes() {
    this.defaultService.get('permissoes')
      .subscribe(response => {
        this.permissoes = response as any[];
        this.listaPermissoes = (response as any[]).map(perm => {
          if (this.usuario.id && this.usuario.permissoes.map(permissao => permissao.codigo).includes(perm.codigo)) {
            this.permissaoIds.push(perm.codigo.toString());
          }

          return ({ value: perm.codigo.toString(), label: perm.descricao });
        });
      });
  }

  carregarEmpresas() {
    this.defaultService.get('empresas')
      .subscribe(response => {
        this.listaEmpresas = (response as Empresa[]).map(emp => ({ value: emp.id.toString(), label: emp.nomeFantasia, disabled: false }));
        this.listaEmpresas.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  salvar(form) {
    if (form.invalid) {
      this.isSubmit = true;
      return;
    }

    this.usuario.permissoes = this.permissoes.filter(permissao => this.permissaoIds.includes(permissao.codigo.toString()));
    this.usuario.empresa.id = Number(this.empresaId);

    if (!this.usuario.id) {
      this.defaultService.salvar('usuarios', this.usuario)
        .subscribe(response => {
          this.usuario = response as Usuario;
          this.toastService.addToast('success', 'Cadastro Usuário!', `Usuário ${this.usuario.nome} salvo com sucesso!`);
        });
    } else {
      this.defaultService.atualizar('usuarios', this.usuario)
        .subscribe(response => {
          this.usuario = response as Usuario;
          this.toastService.addToast('success', 'Atualização Usuário!', `Usuário ${this.usuario.nome} atualizado com sucesso!`);
        });
    }
  }
}
