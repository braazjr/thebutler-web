import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../../../services/default.service';
import swal from 'sweetalert2';
import { Rota } from '../../../models/rota';

@Component({
  selector: 'app-rota-lista',
  templateUrl: './rota-lista.component.html',
  styleUrls: ['./rota-lista.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class RotaListaComponent implements OnInit {

  observable: any;

  listaRotas: Rota[] = [];
  listaRotasTemp: Rota[] = [];
  rota: Rota;

  offset = 0;

  constructor(
    private _defaultService: DefaultService
  ) { }

  ngOnInit() {
    this.getRotas();
  }

  getRotas() {
    this.observable = this._defaultService.get('rotas').subscribe(data => {
      this.listaRotasTemp = this.listaRotas = data as Rota[];
    }, error => {
      console.error(error)
    });
  }

  excluir(rota) {
    swal({
      title: 'Exclusão de rota',
      text: `Deseja excluir a rota: ${rota.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value)
        this.observable = this._defaultService.excluir('rotas', rota.id).subscribe(() => {
          this.getRotas();
        });
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.listaRotas.filter((rot) => rot.nome.toLowerCase().indexOf(val) !== -1 || !val);

    this.listaRotasTemp = temp;
    this.offset = 0;
  }
}
