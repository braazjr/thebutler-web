import { Component, OnInit } from '@angular/core';
import { PassageiroService } from '../../../services/passageiro.service';
import { IOption } from 'ng-select';
import { DefaultService } from '../../../services/default.service';
import { Condominio } from '../../../models/condominio-model';
import { Bloco } from '../../../models/bloco-model';
import { SharedService } from '../../../shared/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { Passageiro } from 'src/app/models/passageiro-model';

import * as lodash from 'lodash';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-passageiro-lista',
  templateUrl: './passageiro-lista.component.html',
  styleUrls: ['./passageiro-lista.component.scss']
})
export class PassageiroListaComponent implements OnInit {

  listaData: {
    size: number,
    totalElements: number,
    totalPages: number,
    page: number,
    sort: string,

    condominioId?: string,
    blocoId?: string,
    nome?: string,
    documento?: string,
    apartamentoNumero?: string,
    ativo?: boolean
  };
  listaPassageiros: any[] = [];

  listaCondominios: Array<IOption> = [];
  listaBlocos: Array<IOption> = [];

  filtroComPassageiros: Array<IOption> = [
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
    private passageiroService: PassageiroService,
    private defaultService: DefaultService,
    private sharedService: SharedService,
    private toastService: ToastService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'nomePassageiro,asc',
      blocoId: '0',
      condominioId: '0'
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });

    this.carregarCondominios();
    this.carregarBlocos();
  }

  setPage(pageInfo) {
    this.listaData.page = pageInfo.offset;
    this.getPassageiros();
  }

  onSort(event) {
    this.listaData.sort = event.column.prop + ',' + event.newValue;
    this.getPassageiros();
  }

  getPassageiros() {
    const listaData = lodash.clone(this.listaData);

    this.passageiroService.getPassageiros(listaData)
      .subscribe(data => {
        this.listaData.page = data['number'];
        this.listaData.size = data['size'];
        this.listaData.totalElements = data['totalElements'];
        this.listaData.totalPages = data['totalPages'];
        this.listaPassageiros = data['content'] as any[];
      });
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
      sort: 'nomePassageiro,asc',
      blocoId: '0',
      condominioId: '0'
    };

    this.getPassageiros();
  }

  excluir(passageiro: Passageiro) {
    Swal.fire({
      title: 'Exclusão de passageiro',
      text: `Deseja excluir o passageiro: ${passageiro.nome}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.defaultService.excluir('passageiros', passageiro.id)
          .subscribe(() => {
            this.toastService.addToast('success', 'Exclusão de Passageiro(a)!', `Passageiro(a) excluído com sucesso!`);
            this.setPage({ offset: 0 });
          });
      }
    })
  }
}
