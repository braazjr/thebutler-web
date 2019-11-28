import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../models/empresa-model';
import { DefaultService } from '../../../services/default.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa-lista',
  templateUrl: './empresa-lista.component.html',
  styleUrls: ['./empresa-lista.component.scss']
})
export class EmpresaListaComponent implements OnInit {

  observable: any;

  listaEmpresas: Empresa[] = [];
  listaEmpresasTemp: Empresa[] = [];
  empresa: Empresa;

  offset = 0;

  constructor(
    private defaultService: DefaultService
  ) { }

  ngOnInit() {
    this.getEmpresas();
  }

  getEmpresas() {
    this.observable = this.defaultService.get('empresas').subscribe(data => {
      this.listaEmpresasTemp = this.listaEmpresas = data as Empresa[];
    }, error => {
      console.error(error)
    });
  }

  excluir(empresa) {
    Swal.fire({
      title: 'Exclusão de empresa',
      text: `Deseja excluir a empresa: ${empresa.razaoSocial}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value)
        this.observable = this.defaultService.excluir('empresas', empresa.id).subscribe(() => {
          this.getEmpresas();
        });
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.listaEmpresas.filter(function (d) {
      return (d.razaoSocial.toLowerCase().indexOf(val) !== -1 || d.nomeFantasia.toLowerCase().indexOf(val) !== -1) || !val;
    });

    this.listaEmpresasTemp = temp;
    this.offset = 0;
  }
}
