import { Component, OnInit } from '@angular/core';
import { Construtora } from '../../../models/construtora-model';
import { DefaultService } from '../../../services/default.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-construtora-lista',
  templateUrl: './construtora-lista.component.html',
  styleUrls: ['./construtora-lista.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ConstrutoraListaComponent implements OnInit {

  observable: any;

  listaConstrutoras: Construtora[] = [];
  listaConstrutorasTemp: Construtora[] = [];
  construtora: Construtora;

  offset = 0;

  constructor(
    private _defaultService: DefaultService
  ) { }

  ngOnInit() {
    this.getConstrutoras();
  }

  getConstrutoras() {
    this.observable = this._defaultService.get('construtoras').subscribe(data => {
      this.listaConstrutorasTemp = this.listaConstrutoras = data as Construtora[];
    }, error => {
      console.error(error)
    });
  }

  excluir(construtora) {
    swal({
      title: 'Exclusão de construtora',
      text: `Deseja excluir a construtora: ${construtora.razaoSocial}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value)
        this.observable = this._defaultService.excluir('construtoras', construtora.id).subscribe(() => {
          this.getConstrutoras();
        });
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
