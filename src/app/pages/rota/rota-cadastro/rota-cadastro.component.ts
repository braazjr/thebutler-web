import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Rota } from '../../../models/rota';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-rota-cadastro',
  templateUrl: './rota-cadastro.component.html',
  styleUrls: ['./rota-cadastro.component.scss']
})
export class RotaCadastroComponent implements OnInit {

  rota: Rota = new Rota();

  formulario: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.rota.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      ativo: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.min(1), Validators.max(40)]]
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.spinner.show();
    this.defaultService.getById('rotas', this.rota.id).subscribe(response => {
      this.rota = response as Rota;
    }, error => {
      this.spinner.hide();
      console.error(error);
    }, () => this.spinner.hide())
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      Swal.fire('Cadastro de rota', 'Não é possível salvar o rota!<br>Existem campos inválidos', 'error');
    } else {
      this.rota.usuario = this.sharedService.getUsuarioLogged();

      this.spinner.show();
      if (!this.rota.id) {
        this.defaultService.salvar('rotas', this.rota).subscribe(response => {
          this.rota = response as Rota;
          this.toastService.addToast('success', 'Cadastro Rota!', `Rota ${this.rota.nome} salvo com sucesso!`);
        }, error => {
          this.spinner.hide();
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Rota!', element.mensagemUsuario);
          });
        }, () => this.spinner.hide())
      } else {
        this.defaultService.atualizar('rotas', this.rota).subscribe(response => {
          this.rota = response as Rota;
          this.toastService.addToast('success', 'Atualização Rota!', `Rota ${this.rota.nome} atualizado com sucesso!`);
        }, error => {
          this.spinner.hide();
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Rota!', element.mensagemUsuario);
          });
        }, () => this.spinner.hide())
      }
    }
  }
}
