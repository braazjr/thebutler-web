import { Injectable } from '@angular/core';

@Injectable()
export class DataTablesService {

  constructor() { }

  translate() {
    return {
      "emptyTable": "Nenhum resultado encontrado",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ resultados",
      "infoEmpty": "Mostrando nenhum resultado",
      "infoFiltered": "(Filtrando _MAX_ resultados)",
      "infoPostFix": "",
      "lengthMenu": "Monstrando _MENU_ resultados",
      "loadingRecords": "Carregando...",
      "processing": "Processando...",
      "search": "Pesquisar:",
      "zeroRecords": "Nenhum registro encontrado",
      "paginate": {
        "first": `<i class='zmdi zmdi-skip-previous'></i>`,
        "last": `<i class='zmdi zmdi-skip-next'></i>`,
        "next": `<i class='zmdi zmdi-chevron-right'></i>`,
        "previous": `<i class='zmdi zmdi-chevron-left'></i>`
      },
      "aria": {
        "sortAscending": ": Ativada a ordenação ascendente",
        "sortDescending": ": Ativada a ordenação descendente"
      }
    };
  }
}
