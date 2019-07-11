import { Component, OnInit } from '@angular/core';
import { Bloco } from '../../../models/bloco-model';
import { DefaultService } from '../../../services/default.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-bloco-lista',
  templateUrl: './bloco-lista.component.html',
  styleUrls: ['./bloco-lista.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class BlocoListaComponent implements OnInit {

  observable: any;

  listaBlocos: Bloco[] = [];
  bloco: Bloco;

  constructor(private _defaultService: DefaultService) { }

  ngOnInit() {
    this.getBlocos();
  }

  getBlocos() {
    this.observable = this._defaultService.get('bloco').subscribe(data => {
      this.listaBlocos = data as Bloco[];
    }, error => {
      console.error(error)
    });
  }

  excluir(bloco: Bloco) {
    swal({
      title: 'Exclusão de bloco',
      text: `Deseja excluir a bloco: ${bloco.nome}|${bloco.numero}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value)
        this.observable = this._defaultService.excluir('bloco', bloco.id).subscribe(() => {
          this.getBlocos();
        });
    })
  }
}
