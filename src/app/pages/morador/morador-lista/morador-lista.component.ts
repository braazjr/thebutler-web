import { Component, OnInit } from '@angular/core';
import { MoradorService } from '../../../services/morador.service';
import { IOption } from 'ng-select';
import { DefaultService } from '../../../services/default.service';
import { Condominio } from '../../../models/condominio-model';
import { Bloco } from '../../../models/bloco-model';

import * as lodash from 'lodash';

@Component({
  selector: 'app-morador-lista',
  templateUrl: './morador-lista.component.html',
  styleUrls: ['./morador-lista.component.scss']
})
export class MoradorListaComponent implements OnInit {

  listaData: {
    size: number,
    totalElements: number,
    totalPages: number,
    page: number,
    sort: string,

    nome?: string,
    documento?: string,
    numeroApartamento?: number,
    idBloco?: string,
    idCondominio?: string,
    ativo?: boolean
  };
  listaMoradores: any[] = [];

  listaCondominios: Array<IOption> = [];
  listaBlocos: Array<IOption> = [];

  filtroComMoradores: Array<IOption> = [
    {
      value: '',
      label: 'Ambos'
    },
    {
      value: 'true',
      label: 'Sim'
    },
    {
      value: 'false',
      label: 'Não'
    }
  ];

  constructor(
    private moradorService: MoradorService,
    private defaultService: DefaultService,
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'nomeMorador,asc',
      idBloco: '0',
      idCondominio: '0'
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });

    this.carregarCondominios();
    this.carregarBlocos();
  }

  setPage(pageInfo) {
    this.listaData.page = pageInfo.offset;
    this.getMoradores();
  }

  onSort(event) {
    this.listaData.sort = event.column.prop + ',' + event.newValue;
    this.getMoradores();
  }

  getMoradores() {
    const listaData = lodash.clone(this.listaData);
    if (listaData.idBloco == '0') delete listaData.idBloco;
    if (listaData.idCondominio === '0') delete listaData.idCondominio;

    this.moradorService.getViewApartamentoMorador(listaData).subscribe(data => {
      this.listaData.page = data['number'];
      this.listaData.size = data['size'];
      this.listaData.totalElements = data['totalElements'];
      this.listaData.totalPages = data['totalPages'];
      this.listaMoradores = data['content'] as any[];
    }, error => {
      console.error(error)
    });
  }

  carregarCondominios() {
    this.defaultService.get('condominios').subscribe(response => {
      this.listaCondominios = (response as Condominio[]).map(cond => ({ value: cond.id.toString(), label: cond.empresa.nomeFantasia + ' - ' + cond.nome }));
      this.listaCondominios.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
    }, error => console.error(error));
  }

  carregarBlocos() {
    this.defaultService.get('blocos').subscribe(response => {
      this.listaBlocos = (response as Bloco[]).map(bloco => ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + bloco.nome }));
      this.listaBlocos.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
    }, error => console.error(error));
  }

  limparPesquisa() {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'nomeMorador,asc'
    };

    this.getMoradores();
  }
}
