import { Component, OnInit } from '@angular/core';
import { Bloco } from '../../../models/bloco-model';
import { DefaultService } from '../../../services/default.service';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-bloco-lista',
  templateUrl: './bloco-lista.component.html',
  styleUrls: ['./bloco-lista.component.scss']
})
export class BlocoListaComponent implements OnInit {

  listaBlocos: Bloco[] = [];
  listaBlocosTemp: Bloco[] = [];
  bloco: Bloco;

  offset = 0;

  constructor(
    private defaultService: DefaultService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getBlocos();
  }

  getBlocos() {
    this.spinner.show();
    this.defaultService.get('blocos').subscribe(data => {
      this.listaBlocosTemp = this.listaBlocos = data as Bloco[];
    }, error => {
      console.error(error)
    }, () => this.spinner.hide());
  }

  excluir(bloco: Bloco) {
    Swal.fire({
      title: 'Exclusão de bloco',
      text: `Deseja excluir a bloco: ${bloco.nome}|${bloco.numero}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this.defaultService.excluir('blocos', bloco.id).subscribe(() => {
          this.getBlocos();
        });
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.listaBlocos.filter(function (blo) {
      return (
        blo.nome.toLowerCase().indexOf(val) !== -1
        || blo.condominio.nome.toLowerCase().indexOf(val) !== -1
        || blo.condominio.construtora.nomeFantasia.toLowerCase().indexOf(val) !== -1
      ) || !val;
    });

    this.listaBlocosTemp = temp;
    this.offset = 0;
  }
}
