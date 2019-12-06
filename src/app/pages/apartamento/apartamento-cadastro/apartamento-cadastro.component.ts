import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Apartamento } from '../../../models/apartamento-model';
import { IOption } from 'ng-select';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { ToastService } from '../../../services/toast.service';
import { Bloco } from '../../../models/bloco-model';
import { SharedService } from 'src/app/shared/shared.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-apartamento-cadastro',
  templateUrl: './apartamento-cadastro.component.html',
  styleUrls: ['./apartamento-cadastro.component.scss']
})
export class ApartamentoCadastroComponent implements OnInit {

  apartamento: Apartamento = new Apartamento();
  listaBlocos: Array<IOption> = [];

  formulario: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private toastService: ToastService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.getById(params['id']);
      }
    });

    this.formulario = this.formBuilder.group({
      blocoId: ['0', [Validators.required, Validators.min(1)]],
      ativo: ['', [Validators.required]],
      numero: ['', [Validators.required, Validators.min(1)]]
    });

    this.carregarBlocos();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById(id) {
    this.defaultService.getById('apartamentos', id)
      .subscribe(response => {
        this.apartamento = response as Apartamento;
        this.formulario.patchValue(response);
        this.formulario.get('blocoId').setValue(this.apartamento.bloco.id.toString());
        this.carregarBlocos();
      });
  }

  carregarBlocos() {
    this.defaultService.get('blocos')
      .subscribe(response => {
        this.listaBlocos = (response as Bloco[]).map(bloco => ({ value: bloco.id.toString(), label: bloco.condominio.nome + ' - ' + bloco.nome }));
        this.listaBlocos.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
      });
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      Swal.fire('Cadastro de apartamento', 'Não é possível salvar o apartamento!<br>Existem campos inválidos', 'error');
    } else {
      this.apartamento.usuario = this.sharedService.getUsuarioLogged();
      this.apartamento.bloco.id = this.formulario.get('blocoId').value;
      this.apartamento.numero = this.formulario.get('numero').value;
      this.apartamento.ativo = this.formulario.get('ativo').value;

      if (!this.apartamento.id) {
        this.defaultService.salvar('apartamentos', this.apartamento)
          .subscribe(response => {
            this.apartamento = response as Apartamento;
            this.toastService.addToast('success', 'Cadastro Apartamento!', `Apartamento ${this.apartamento.numero} salvo com sucesso!`);
          }, () => {
            this.router.navigate([`/ficha/${this.apartamento.id}`]);
          })
      } else {
        this.defaultService.atualizar('apartamentos', this.apartamento)
          .subscribe(response => {
            this.apartamento = response as Apartamento;
            this.toastService.addToast('success', 'Atualização Apartamento!', `Apartamento ${this.apartamento.numero} atualizado com sucesso!`);
          }, () => {
            this.router.navigate([`/ficha/${this.apartamento.id}`]);
          })
      }
    }
  }

  temPacoteParaCadastro() {
    if (this.sharedService.isAdmin() || this.apartamento.id) {
      return true;
    } else if (this.sharedService.getUsuarioLogged().empresa && this.sharedService.getUsuarioLogged().empresa.empresaConfig) {
      const totalElements = localStorage.getItem('apartamento.totalElements');

      if (totalElements) {
        return this.sharedService.getUsuarioLogged().empresa.empresaConfig.qtyApartamentos > Number(totalElements);
      } else {
        this.router.navigate([`/apartamento`]);
      }
    }
  }
}
