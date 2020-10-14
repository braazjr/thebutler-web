import { Component, OnInit } from '@angular/core';
import { Apartamento } from '../../../models/apartamento-model';
import { DefaultService } from '../../../services/default.service';
import { ApartamentoService } from '../../../services/apartamento.service';
import { ToastService } from '../../../services/toast.service';
import { IOption } from 'ng-select';
import { Condominio } from '../../../models/condominio-model';
import { Bloco } from '../../../models/bloco-model';
import { FichaService } from 'src/app/services/ficha.service';
import { Ficha } from '../../../models/ficha-model';
import { SharedService } from '../../../shared/shared.service';

import Swal from 'sweetalert2';
import * as lodash from 'lodash';

@Component({
  selector: 'app-apartamento-lista',
  templateUrl: './apartamento-lista.component.html',
  styleUrls: ['./apartamento-lista.component.scss']
})
export class ApartamentoListaComponent implements OnInit {

  listaData: {
    size: number,
    totalElements: number,
    totalPages: number,
    page: number,
    sort: string,

    idCondominio?: string,
    idBloco?: string,
    numero?: string
  };

  listaApartamentos: Apartamento[] = [];
  apartamento: Apartamento;

  listaCondominios: Array<IOption> = [];
  listaBlocos: Array<IOption> = [];

  apartamentoTemp: Apartamento;
  fichas: any[] = [];

  constructor(
    private defaultService: DefaultService,
    private apartamentoService: ApartamentoService,
    private toastService: ToastService,
    private fichaService: FichaService,
    private sharedService: SharedService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'numero,asc',
      idCondominio: '0',
      idBloco: '0'
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });

    this.carregarCondominios();
    this.carregarBlocos();
  }

  setPage(pageInfo) {
    this.listaData.page = pageInfo.offset;
    this.getApartamentos();
  }

  onSort(event) {
    this.listaData.sort = event.column.prop + ',' + event.newValue;
    this.getApartamentos();
  }

  getApartamentos() {
    const listaData = lodash.clone(this.listaData);

    this.apartamentoService.getApartamentos(listaData)
      .subscribe(data => {
        this.listaData.page = data['number'];
        this.listaData.size = data['size'];
        this.listaData.totalElements = data['totalElements'];
        this.listaData.totalPages = data['totalPages'];
        this.listaApartamentos = data['content'] as any[];

        localStorage.setItem('apartamento.totalElements', String(this.listaData.totalElements));
      });
  }

  excluir(apartamento: Apartamento) {
    Swal.fire({
      title: 'Exclusão de apartamento',
      text: `Deseja excluir a apartamento: ${apartamento.numero}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.defaultService.excluir('apartamentos', apartamento.id)
          .subscribe(() => {
            this.toastService.addToast('success', 'Exclusão de Apartamento!', `Apartamento excluído com sucesso!`);
            this.setPage({ offset: 0 });
          });
      }
    })
  }

  carregarCondominios() {
    this.defaultService.get('condominios')
      .subscribe(response => {
        this.listaCondominios = (response as Condominio[])
          .map(cond => ({
            value: cond.id.toString(),
            label: this.sharedService.isAdmin() ? `${cond.empresa.nomeFantasia} - ${cond.nome}` : cond.nome
          }));
        this.listaCondominios.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  carregarBlocos() {
    this.defaultService.get('blocos')
      .subscribe(response => {
        this.listaBlocos = (response as Bloco[]).map(bloco => ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + (bloco.nome || bloco.numero) }));
        this.listaBlocos.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  limparPesquisa() {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'numero,asc',
      idCondominio: '0',
      idBloco: '0'
    };

    this.setPage({ offset: 0 });
  }

  excluirFicha(ficha: Ficha) {
    Swal.fire({
      title: 'Exclusão de ficha',
      text: `Deseja excluir a ficha: ${ficha.id}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.defaultService.excluir('fichas', ficha.id)
          .subscribe(() => {
            this.toastService.addToast('success', 'Exclusão de Ficha!', `Ficha excluída com sucesso!`);
            this.setPage({ offset: 0 });
          });
      }
    })
  }
}
