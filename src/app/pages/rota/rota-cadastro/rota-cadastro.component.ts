import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Rota } from '../../../models/rota';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from '../../../services/default.service';

@Component({
  selector: 'app-rota-cadastro',
  templateUrl: './rota-cadastro.component.html',
  styleUrls: ['./rota-cadastro.component.scss']
})
export class RotaCadastroComponent implements OnInit {

  rota: Rota = new Rota();

  isSubmit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.rota.id = params['id'];
        this.getById();
      } else {
        this.rota.ativo = true;
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.defaultService.getById('rotas', this.rota.id)
      .subscribe(response => {
        this.rota = response as Rota;
      });
  }

  salvar(form) {
    if (form.invalid) {
      this.isSubmit = true;
      return;
    } else {
      if (!this.rota.id) {
        this.defaultService.salvar('rotas', this.rota)
          .subscribe(response => {
            this.rota = response as Rota;
            this.router.navigate(['/rota/lista']);
          });
      } else {
        this.defaultService.atualizar('rotas', this.rota)
          .subscribe(response => {
            this.rota = response as Rota;
            this.router.navigate(['/rota/lista']);
          });
      }
    }
  }
}
