import { Component, OnInit, ViewChild } from '@angular/core';
import { ViagemService } from '../../../services/viagem.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    sort: string
  };
  listaViagens: any[] = [];

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
    private spinner: NgxSpinnerService
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
    this.spinner.show();
    this.viagemService.getViagens(this.listaData).subscribe(data => {
      this.listaData.page = data['number'];
      this.listaData.size = data['size'];
      this.listaData.totalElements = data['totalElements'];
      this.listaData.totalPages = data['totalPages'];
      this.listaViagens = data['content'] as any[];
    }, error => {
      this.spinner.hide();
      console.error(error);
    }, () => this.spinner.hide());
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
}
