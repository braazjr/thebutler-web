import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Rota } from '../../../models/rota';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';

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
    private sharedService: SharedService,
    private toastService: ToastService,
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
      this.rota.usuario = this.sharedService.getUsuarioLogged();

      if (!this.rota.id) {
        this.defaultService.salvar('rotas', this.rota)
          .subscribe(response => {
            this.rota = response as Rota;
            this.toastService.addToast('success', 'Cadastro Rota!', `Rota ${this.rota.nome} salvo com sucesso!`);
          });
      } else {
        this.defaultService.atualizar('rotas', this.rota)
          .subscribe(response => {
            this.rota = response as Rota;
            this.toastService.addToast('success', 'Atualização Rota!', `Rota ${this.rota.nome} atualizado com sucesso!`);
          });
      }
    }
  }
}
