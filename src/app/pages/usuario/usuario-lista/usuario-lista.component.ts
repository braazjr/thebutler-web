import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario-model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.scss']
})
export class UsuarioListaComponent implements OnInit {

  listaData: {
    size: number,
    totalElements: number,
    totalPages: number,
    page: number
  };
  listaUsuarios: Usuario[] = [];
  usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.listaData.page = pageInfo.offset;

    this.spinner.show();
    this.usuarioService.getUsuarioPorEmpresa(this.listaData).subscribe(data => {
      this.listaData = {
        page: data['number'],
        size: data['size'],
        totalElements: data['totalElements'],
        totalPages: data['totalPages']
      };
      this.listaUsuarios = data['content'] as Usuario[];
    }, error => {
      this.spinner.hide();
      console.error(error);
    }, () => this.spinner.hide());
  }

  listarPermissoes(permissoes: any[]) {
    if (permissoes.length <= 0) {
      return '';
    }

    return permissoes.map(permissao => permissao.descricao).join(', ');
  }
}
