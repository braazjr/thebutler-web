import { Component, OnInit } from '@angular/core';
import { Apartamento } from '../../../models/apartamento-model';
import { DefaultService } from '../../../services/default.service';
import { ApartamentoService } from '../../../services/apartamento.service';
import { ToastService } from '../../../services/toast.service';
import { IOption } from 'ng-select';
import { Condominio } from '../../../models/condominio-model';
import { Bloco } from '../../../models/bloco-model';
import { SharedService } from 'src/app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

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
    numero?: string,
    comMoradores?: string
  };

  listaApartamentos: Apartamento[] = [];
  apartamento: Apartamento;

  listaCondominios: Array<IOption> = [];
  listaBlocos: Array<IOption> = [];

  filtroComMoradores: Array<IOption> = [
    {
      value: '0',
      label: 'Ambos'
    },
    {
      value: 'true',
      label: 'Com moradores'
    },
    {
      value: 'false',
      label: 'Sem moradores'
    }
  ];

  constructor(
    private defaultService: DefaultService,
    private apartamentoService: ApartamentoService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'numero,asc',
      idCondominio: '0',
      idBloco: '0',
      comMoradores: '0'
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
    this.spinner.show();
    this.apartamentoService.getApartamentos(this.listaData).subscribe(data => {
      this.listaData.page = data['number'];
      this.listaData.size = data['size'];
      this.listaData.totalElements = data['totalElements'];
      this.listaData.totalPages = data['totalPages'];
      this.listaApartamentos = data['content'] as any[];
    }, error => {
      console.error(error);
      this.spinner.hide();
    }, () => this.spinner.hide());
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
        this.spinner.show();
        this.defaultService.excluir('apartamentos', apartamento.id).subscribe(() => {
          this.toastService.addToast('success', 'Exclusão de Apartamento!', `Apartamento excluído com sucesso!`);
          this.setPage({ offset: 0 });
          this.spinner.hide();
        });
      }
    })
  }

  carregarCondominios() {
    this.defaultService.get('condominios').subscribe(response => {
      this.listaCondominios = (response as Condominio[]).map(cond => ({ value: cond.id.toString(), label: cond.construtora.nomeFantasia + ' - ' + cond.nome }));
      this.listaCondominios.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
    }, error => console.error(error));
  }

  carregarBlocos() {
    this.defaultService.get('blocos').subscribe(response => {
      this.listaBlocos = (response as Bloco[]).map(bloco => ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + bloco.nome }));
      this.listaBlocos.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
    }, error => console.error(error));
  }

  temPacoteParaCadastro() {
    if (this.sharedService.getUsuarioLogged().empresa && this.sharedService.getUsuarioLogged().empresa.empresaConfig)
      return this.sharedService.getUsuarioLogged().empresa.empresaConfig.qtyApartamentos > this.listaData.totalElements;
  }
}
