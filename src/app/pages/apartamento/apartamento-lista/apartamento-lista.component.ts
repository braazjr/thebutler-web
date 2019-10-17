import { Component, OnInit } from '@angular/core';
import { Apartamento } from '../../../models/apartamento-model';
import { DefaultService } from '../../../services/default.service';
import swal from 'sweetalert2';
import { ApartamentoService } from '../../../services/apartamento.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';
import { IOption } from 'ng-select';
import { Condominio } from '../../../models/condominio-model';
import { Bloco } from '../../../models/bloco-model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-apartamento-lista',
  templateUrl: './apartamento-lista.component.html',
  styleUrls: ['./apartamento-lista.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ApartamentoListaComponent implements OnInit {

  observable: any;

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
      value: '',
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
    private router: Router,
    private sharedService: SharedService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'numero,asc'
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
    this.observable = this.apartamentoService.getApartamentos(this.listaData).subscribe(data => {
      this.listaData.page = data['number'];
      this.listaData.size = data['size'];
      this.listaData.totalElements = data['totalElements'];
      this.listaData.totalPages = data['totalPages'];
      this.listaApartamentos = data['content'] as any[];
    }, error => {
      console.error(error);
    });
  }

  excluir(apartamento: Apartamento) {
    swal({
      title: 'Exclusão de apartamento',
      text: `Deseja excluir a apartamento: ${apartamento.numero}?`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.value) {
        this.observable = this.defaultService.excluir('apartamento', apartamento.id).subscribe(() => {
          this.toastService.addToast('success', 'Exclusão de Apartamento!', `Apartamento excluído com sucesso!`);
          this.router.navigate(['/apartamento/lista']);
        });
      }
    })
  }

  carregarCondominios() {
    this.defaultService.get('condominio').subscribe(response => {
      this.listaCondominios = (response as Condominio[]).map(cond => ({ value: cond.id.toString(), label: cond.construtora.nomeFantasia + ' - ' + cond.nome }));
    }, error => console.error(error));
  }

  carregarBlocos() {
    this.defaultService.get('bloco').subscribe(response => {
      this.listaBlocos = (response as Bloco[]).map(bloco => ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + bloco.nome }));
    }, error => console.error(error));
  }
}
