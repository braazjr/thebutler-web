import { Component, OnInit, ViewChild } from '@angular/core';
import { ViagemService } from '../../../services/viagem.service';

@Component({
  selector: 'app-viagem-lista',
  templateUrl: './viagem-lista.component.html',
  styleUrls: ['./viagem-lista.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ViagemListaComponent implements OnInit {

  observable: any;

  listaData: {
    size: number,
    totalElements: number,
    totalPages: number,
    page: number,
    sort: string
  };
  listaViagens: any[] = [];

  expanded: any = {};
  @ViewChild('table') table: any;

  constructor(
    private viagemService: ViagemService
  ) {
    this.listaData = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      sort: 'id,desc'
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
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
    this.observable = this.viagemService.getViagens(this.listaData).subscribe(data => {
      this.listaData.page = data['number'];
      this.listaData.size = data['size'];
      this.listaData.totalElements = data['totalElements'];
      this.listaData.totalPages = data['totalPages'];
      this.listaViagens = data['content'] as any[];
    }, error => {
      console.error(error);
    });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
}
