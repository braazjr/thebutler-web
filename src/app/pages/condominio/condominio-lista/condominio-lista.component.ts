import { Component, OnInit } from '@angular/core';
import { Condominio } from '../../../models/condominio-model';
import { DefaultService } from '../../../services/default.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-condominio-lista',
  templateUrl: './condominio-lista.component.html',
  styleUrls: ['./condominio-lista.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class CondominioListaComponent implements OnInit {

  observable: any;

  listaCondominios: Condominio[] = [];
  condominio: Condominio;

  constructor(private _defaultService: DefaultService) { }

  ngOnInit() {
    this.getCondominios();
  }

  getCondominios() {
    this.observable = this._defaultService.get('condominio').subscribe(data => {
      this.listaCondominios = data as Condominio[];
    }, error => {
      console.error(error)
    });
  }

  excluir(condominio) {
    swal({
      title: 'Exclusão de condominio',
      text: `Deseja excluir a condominio: ${condominio.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value)
        this.observable = this._defaultService.excluir('condominio', condominio.id).subscribe(() => {
          this.getCondominios();
        });
    })
  }
}
