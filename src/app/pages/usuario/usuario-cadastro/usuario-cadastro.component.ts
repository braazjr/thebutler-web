import { Empresa } from './../../../models/empresa-model';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Usuario } from '../../../models/usuario-model';
import { IOption } from 'ng-select';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
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
  permissoes: String[] = [];
  empresaId: string = '0';

  isSubmit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private cdr: ChangeDetectorRef,
    public sharedService: SharedService,
    private router: Router
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
        this.permissoes = response as String[];
        this.listaPermissoes = (this.permissoes as any[]).map(perm => ({ value: perm.toString(), label: perm }))
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
    if (form.invalid || (!this.usuario.permissoes || this.usuario.permissoes.length == 0)) {
      this.isSubmit = true;
      return;
    }

    this.usuario.username = this.usuario.username.toLowerCase();
    this.usuario['empresaId'] = this.empresaId;
    if (this.usuario.email && !this.usuario.username) {
      this.usuario.username = this.usuario.email
    }

    if (!this.usuario.id) {
      this.defaultService.salvar('usuarios', this.usuario)
        .subscribe(response => {
          this.usuario = response as Usuario;
          this.router.navigate(['/usuario/lista']);
        });
    } else {
      this.defaultService.atualizar('usuarios', this.usuario)
        .subscribe(response => {
          this.usuario = response as Usuario;
          this.router.navigate(['/usuario/lista']);
        });
    }
  }

  getShortName() {
    const usuarioSplit = (this.usuario.nome || '').split(' ');
    return `${usuarioSplit[0]} ${usuarioSplit[usuarioSplit.length - 1]}`
  }
}
