import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario-model';
import { DefaultService } from '../../../services/default.service';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from '../../../shared/shared.service';

import Swal from 'sweetalert2';

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
    private defaultService: DefaultService,
    private toastService: ToastService,
    public sharedService: SharedService
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

    this.usuarioService.getUsuarios(this.listaData)
      .subscribe(data => {
        this.listaData = {
          page: data['number'],
          size: data['size'],
          totalElements: data['totalElements'],
          totalPages: data['totalPages']
        };
        this.listaUsuarios = data['content'] as Usuario[];
      });
  }

  listarPermissoes(permissoes: any[]) {
    if (permissoes.length <= 0) {
      return '';
    }

    return permissoes.map(permissao => permissao.descricao).join(', ');
  }

  excluir(usuario: Usuario) {
    Swal.fire({
      title: 'Exclusão de usuário',
      text: `Deseja excluir o usuário: ${usuario.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.defaultService.excluir('usuarios', usuario.id)
          .subscribe(() => {
            this.toastService.addToast('success', 'Exclusão de usuário!', `Usuário excluído com sucesso!`);
            this.setPage({ offset: 0 });
          });
      }
    })
  }
}
