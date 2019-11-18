import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Bloco } from '../../../models/bloco-model';
import { IOption } from 'ng-select';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { Condominio } from '../../../models/condominio-model';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-bloco-cadastro',
  templateUrl: './bloco-cadastro.component.html',
  styleUrls: ['./bloco-cadastro.component.scss']
})
export class BlocoCadastroComponent implements OnInit {

  bloco: Bloco = new Bloco();
  listaCondominios: Array<IOption> = [];
  condominioId: string = '0';

  cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cnpjRegex = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
  cepRegex = /^\d{5}-\d{3}$/;
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
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
        this.bloco.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      condominio: ['', [Validators.required, Validators.min(1)]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      ativo: ['', [Validators.required]],
      numero: ['', [Validators.min(1)]]
    });

    this.carregarCondominios();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.spinner.show();
    this.defaultService.getById('blocos', this.bloco.id).subscribe(response => {
      this.bloco = response as Bloco;
      this.condominioId = this.bloco.condominio.id.toString();
      this.carregarCondominios();
    }, error => {
      console.error(error);
      this.spinner.hide();
    })
  }

  carregarCondominios() {
    this.spinner.show();
    this.defaultService.get('condominios').subscribe(response => {
      this.listaCondominios = (response as Condominio[]).map(cond => ({ value: cond.id.toString(), label: cond.construtora.nomeFantasia + ' - ' + cond.nome }));
      this.listaCondominios.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
    }, error => console.error(error),
      () => this.spinner.hide());
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      Swal.fire('Cadastro de bloco', 'Não é possível salvar o bloco!<br>Existem campos inválidos', 'error');
    } else {
      this.bloco.usuario = this.sharedService.getUsuarioLogged();
      this.bloco.condominio.id = Number(this.condominioId);

      this.spinner.show();
      if (!this.bloco.id) {
        this.defaultService.salvar('blocos', this.bloco).subscribe(response => {
          this.bloco = response as Bloco;
          this.toastService.addToast('success', 'Cadastro Bloco!', `Bloco ${this.bloco.nome} salvo com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Bloco!', element.mensagemUsuario);
          });
        }, () => this.spinner.hide())
      } else {
        this.defaultService.atualizar('blocos', this.bloco).subscribe(response => {
          this.bloco = response as Bloco;
          this.toastService.addToast('success', 'Atualização Bloco!', `Bloco ${this.bloco.nome} atualizado com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Bloco!', element.mensagemUsuario);
          });
        }, () => this.spinner.hide())
      }
    }
  }
}
