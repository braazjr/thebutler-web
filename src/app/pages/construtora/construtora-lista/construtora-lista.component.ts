import { Component, OnInit } from '@angular/core';
import { Construtora } from '../../../models/construtora-model';
import { DefaultService } from '../../../services/default.service';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-construtora-lista',
  templateUrl: './construtora-lista.component.html',
  styleUrls: ['./construtora-lista.component.scss']
})
export class ConstrutoraListaComponent implements OnInit {

  listaConstrutoras: Construtora[] = [];
  listaConstrutorasTemp: Construtora[] = [];
  construtora: Construtora;

  offset = 0;

  constructor(
    private defaultService: DefaultService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getConstrutoras();
  }

  getConstrutoras() {
    this.spinner.show();
    this.defaultService.get('construtoras').subscribe(data => {
      this.listaConstrutorasTemp = this.listaConstrutoras = data as Construtora[];
    }, error => {
      console.error(error)
    }, () => this.spinner.hide());
  }

  excluir(construtora) {
    Swal.fire({
      title: 'Exclusão de construtora',
      text: `Deseja excluir a construtora: ${construtora.razaoSocial}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.defaultService.excluir('construtoras', construtora.id).subscribe(() => {
          this.getConstrutoras();
        }, error => {
          console.error(error)
        }, () => this.spinner.hide());
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.listaConstrutoras.filter(function (constr) {
      return (constr.razaoSocial.toLowerCase().indexOf(val) !== -1 || constr.nomeFantasia.toLowerCase().indexOf(val) !== -1) || !val;
    });

    this.listaConstrutorasTemp = temp;
    this.offset = 0;
  }
}
