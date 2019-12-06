import { Component, OnInit } from '@angular/core';
import { Condominio } from '../../../models/condominio-model';
import { DefaultService } from '../../../services/default.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-condominio-lista',
  templateUrl: './condominio-lista.component.html',
  styleUrls: ['./condominio-lista.component.scss']
})
export class CondominioListaComponent implements OnInit {

  listaCondominios: Condominio[] = [];
  listaCondominiosTemp: Condominio[] = [];
  condominio: Condominio;

  offset = 0;

  constructor(
    private defaultService: DefaultService
  ) { }

  ngOnInit() {
    this.getCondominios();
  }

  getCondominios() {
    this.defaultService.get('condominios')
      .subscribe(data => {
        this.listaCondominiosTemp = this.listaCondominios = data as Condominio[];
      });
  }

  excluir(condominio) {
    Swal.fire({
      title: 'Exclusão de condominio',
      text: `Deseja excluir a condominio: ${condominio.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.defaultService.excluir('condominios', condominio.id)
          .subscribe(() => {
            this.getCondominios();
          });
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.listaCondominios.filter(function (cond) {
      return (cond.nome.toLowerCase().indexOf(val) !== -1 || cond.empresa.nomeFantasia.toLowerCase().indexOf(val) !== -1) || !val;
    });

    this.listaCondominiosTemp = temp;
    this.offset = 0;
  }
}
