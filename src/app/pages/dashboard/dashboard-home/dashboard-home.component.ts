import { Component, OnInit } from '@angular/core';
import { DefaultService } from 'src/app/services/default.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  viagensHoje: Number = 0;
  viagensUltimaSemana: Number = 0;
  viagensMesAtual: Number = 0;

  constructor(
    private defaultService: DefaultService
  ) { }

  ngOnInit() {
    this.getViagensHoje();
  }

  getViagensHoje() {
    this.defaultService.get('dashboards/quantidade-viagens-dia-atual')
      .subscribe(data => this.viagensHoje = data as Number);
  }

  getViagensUltimaSemana() {
    this.defaultService.get('dashboards/quantidade-viagens-ultima-semana')
      .subscribe(data => this.viagensUltimaSemana = data as Number);
  }

  getViagensMesAtual() {
    this.defaultService.get('dashboards/quantidade-viagens-mes-atual')
      .subscribe(data => this.viagensMesAtual = data as Number);
  }
}
