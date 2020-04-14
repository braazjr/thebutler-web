import { Component, OnInit } from '@angular/core';
import { DefaultService } from 'src/app/services/default.service';
import { FichaService } from 'src/app/services/ficha.service';
import { Ficha } from 'src/app/models/ficha-model';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { IOption } from 'ng-select';
import { Condominio } from 'src/app/models/condominio-model';
import { Bloco } from 'src/app/models/bloco-model';

@Component({
  selector: 'app-ficha-lista',
  templateUrl: './ficha-lista.component.html',
  styleUrls: ['./ficha-lista.component.scss']
})
export class FichaListaComponent implements OnInit {

  fichas: any[] = []

  listaData: {
    size: number,
    totalElements: number,
    totalPages: number,
    page: number,
    sort: string,

    idCondominio?: string,
    idBloco?: string,
    numeroApartamento?: string,
    codigo?: string,
    dataInicioDe?: string,
    dataInicioPara?: string,
    dataFimDe?: string,
    dataFimPara?: string
  };

  listaCondominios: Array<IOption> = [];
  listaBlocos: Array<IOption> = [];

  constructor(
    private fichaService: FichaService,
    private defaultService: DefaultService,
    private toastService: ToastService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'dataInicio',
      idCondominio: '0',
      idBloco: '0',
      numeroApartamento: '',
      codigo: '',
      dataInicioDe: '',
      dataInicioPara: '',
      dataFimDe: '',
      dataFimPara: ''
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });

    this.carregarCondominios();
    this.carregarBlocos();
  }

  setPage(pageInfo) {
    this.listaData.page = pageInfo.offset;
    this.getFichas();
  }

  getFichas() {
    this.fichaService.get(this.listaData)
      .subscribe(data => {
        this.listaData.page = data['number'];
        this.listaData.size = data['size'];
        this.listaData.totalElements = data['totalElements'];
        this.listaData.totalPages = data['totalPages'];
        this.fichas = data['content'] as any[];
        console.log(this.fichas)
      })
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

  excluir(ficha: Ficha) {
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
            this.toastService.addToast('success', 'Exclusão de ficha!', `Ficha excluída com sucesso!`);
            this.setPage({ offset: 0 });
          });
      }
    })
  }

  limparPesquisa() {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'dataInicio',
      idCondominio: '0',
      idBloco: '0',
      numeroApartamento: '',
      codigo: '',
      dataInicioDe: '',
      dataInicioPara: '',
      dataFimDe: '',
      dataFimPara: ''
    };

    this.setPage({ offset: 0 });
  }
}
