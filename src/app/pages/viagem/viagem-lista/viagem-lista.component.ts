import { Component, OnInit, ViewChild } from '@angular/core';
import { ViagemService } from '../../../services/viagem.service';
import { DefaultService } from 'src/app/services/default.service';
import { Condominio } from 'src/app/models/condominio-model';
import { Bloco } from 'src/app/models/bloco-model';

import * as lodash from 'lodash';

@Component({
  selector: 'app-viagem-lista',
  templateUrl: './viagem-lista.component.html',
  styleUrls: ['./viagem-lista.component.scss']
})
export class ViagemListaComponent implements OnInit {

  listaData: {
    size: number,
    totalElements: number,
    totalPages: number,
    page: number,
    sort: string,

    idCondominio?: string,
    idBloco?: string,
    nomeMorador: string,
    documentoMorador: string,
    numeroApartamento: number
  };

  listaViagens: any[] = [];
  listaCondominios: any[] = [];
  listaBlocos: any[] = [];

  expanded: any = {};
  @ViewChild('table', undefined) table: any;

  customClasses = {
    sortAscending: 'fa fa-sort-numeric-up',
    sortDescending: 'fa fa-sort-up',
    pagerLeftArrow: 'fa fa-chevron-left',
    pagerRightArrow: 'fa fa-chevron-right',
    pagerPrevious: 'fa fa-step-backward',
    pagerNext: 'fa fa-step-forward'
  };

  constructor(
    private viagemService: ViagemService,
    private defaultService: DefaultService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'id,desc',
      idCondominio: '0',
      idBloco: '0',
      nomeMorador: '',
      documentoMorador: '',
      numeroApartamento: null
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });

    this.carregarCondominios();
    this.carregarBlocos();
  }

  setPage(pageInfo) {
    this.listaData.page = pageInfo.offset;

    this.getViagens();
  }

  onSort(event) {
    this.listaData.sort = event.column.prop + ',' + event.newValue;
    this.getViagens();
  }

  getViagens() {
    const listaData = lodash.clone(this.listaData);
    if (listaData.numeroApartamento == null) delete listaData.numeroApartamento;

    this.viagemService.getViagens(listaData)
      .subscribe(data => {
        this.listaData.page = data['number'];
        this.listaData.size = data['size'];
        this.listaData.totalElements = data['totalElements'];
        this.listaData.totalPages = data['totalPages'];
        this.listaViagens = data['content'] as any[];
      });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  carregarCondominios() {
    this.defaultService.get('condominios')
      .subscribe(response => {
        this.listaCondominios = (response as Condominio[]).map(cond => ({ value: cond.id.toString(), label: cond.empresa.nomeFantasia + ' - ' + cond.nome }));
        this.listaCondominios.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  carregarBlocos() {
    this.defaultService.get('blocos')
      .subscribe(response => {
        this.listaBlocos = (response as Bloco[]).map(bloco => ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + bloco.nome }));
        this.listaBlocos.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  limparPesquisa() {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'id,desc',
      idCondominio: '0',
      idBloco: '0',
      nomeMorador: '',
      documentoMorador: '',
      numeroApartamento: null
    };

    this.setPage({ offset: 0 });
  }
}
