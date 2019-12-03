import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../../../services/default.service';
import { Rota } from '../../../models/rota';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-rota-lista',
  templateUrl: './rota-lista.component.html',
  styleUrls: ['./rota-lista.component.scss']
})
export class RotaListaComponent implements OnInit {

  listaRotas: Rota[] = [];
  listaRotasTemp: Rota[] = [];
  rota: Rota;

  offset = 0;

  constructor(
    private defaultService: DefaultService,
  ) { }

  ngOnInit() {
    this.getRotas();
  }

  getRotas() {
    this.defaultService.get('rotas').subscribe(data => {
      this.listaRotasTemp = this.listaRotas = data as Rota[];
    }, error => {
      console.error(error)
    });
  }

  excluir(rota) {
    Swal.fire({
      title: 'Exclusão de rota',
      text: `Deseja excluir a rota: ${rota.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.defaultService.excluir('rotas', rota.id).subscribe(() => {
          this.getRotas();
        }, error => {
          console.error(error);
        });
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.listaRotas.filter((rot) => rot.nome.toLowerCase().indexOf(val) !== -1 || !val);

    this.listaRotasTemp = temp;
    this.offset = 0;
  }
}
