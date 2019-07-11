import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../models/empresa-model';
import { DefaultService } from '../../../services/default.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-empresa-lista',
  templateUrl: './empresa-lista.component.html',
  styleUrls: ['./empresa-lista.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class EmpresaListaComponent implements OnInit {

  observable: any;

  listaEmpresas: Empresa[] = [];
  empresa: Empresa;

  constructor(private _defaultService: DefaultService) { }

  ngOnInit() {
    this.getEmpresas();
  }

  getEmpresas() {
    this.observable = this._defaultService.get('empresa').subscribe(data => {
      this.listaEmpresas = data as Empresa[];
    }, error => {
      console.error(error)
    });
  }

  excluir(empresa) {
    swal({
      title: 'Exclusão de empresa',
      text: `Deseja excluir a empresa: ${empresa.nomeSocial}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value)
        this.observable = this._defaultService.excluir('empresa', empresa.id).subscribe(() => {
          this.getEmpresas();
        });
    })
  }
}
