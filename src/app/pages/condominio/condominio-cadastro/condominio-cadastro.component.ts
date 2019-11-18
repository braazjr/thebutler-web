import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Condominio } from '../../../models/condominio-model';
import { IOption } from 'ng-select';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../../services/default.service';
import { ToastService } from '../../../services/toast.service';
import { Construtora } from '../../../models/construtora-model';
import { SharedService } from 'src/app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-condominio-cadastro',
  templateUrl: './condominio-cadastro.component.html',
  styleUrls: ['./condominio-cadastro.component.scss']
})
export class CondominioCadastroComponent implements OnInit {

  condominio: Condominio = new Condominio();
  listaConstrutoras: Array<IOption> = [];
  construtoraId: string = '0';

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
        this.condominio.id = params['id'];
        this.getById();
      }
    });

    this.formulario = this.formBuilder.group({
      construtora: ['', [Validators.required, Validators.min(1)]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      ativo: ['', [Validators.required]],
      bairro: [{ value: '', disabled: true }, [Validators.required]],
      cidade: [{ value: '', disabled: true }, [Validators.required]],
      estado: [{ value: '', disabled: true }, [Validators.required]],
      cep: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.cepRegex)]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(this.telefoneRegex)]],
      complemento: ['', [Validators.maxLength(50)]],
      rua: [{ value: '', disabled: true }, [Validators.required]],
      numero: ['', [Validators.min(1)]]
    });

    this.carregarConstrutoras();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById() {
    this.spinner.show();
    this.defaultService.getById('condominios', this.condominio.id).subscribe(response => {
      this.condominio = response as Condominio;
      this.construtoraId = this.condominio.construtora.id.toString();
      this.carregarConstrutoras();
    })
  }

  validaCep(value) {
    let cep: string = value.target.value.replace('_', '');
    if (cep.length == 9)
      this.buscaCep(cep.replace('-', ''));
  }

  buscaCep(cep) {
    this.spinner.show();
    this.defaultService.getDadosCep(cep).subscribe(response => {
      this.condominio.rua = response['logradouro'];
      this.condominio.bairro = response['bairro'];
      this.condominio.cidade = response['localidade'];
      this.condominio.estado = response['uf'];
      this.condominio.complemento = response['complemento'];
      this.spinner.hide();
    })
  }

  carregarConstrutoras() {
    this.spinner.show();
    this.defaultService.get('construtoras').subscribe(response => {
      this.listaConstrutoras = (response as Construtora[]).map(constr => ({ value: constr.id.toString(), label: constr.nomeFantasia }));
      this.listaConstrutoras.unshift({ value: '0', label: 'Selecione uma opção', disabled: true });
    }, error => console.error(error)
      , () => this.spinner.hide());
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      Swal.fire('Cadastro de condominio', 'Não é possível salvar o condominio!<br>Existem campos inválidos', 'error');
    } else {
      this.condominio.usuario = this.sharedService.getUsuarioLogged();
      this.condominio.construtora.id = Number(this.construtoraId);

      this.spinner.show();
      if (!this.condominio.id) {
        this.defaultService.salvar('condominios', this.condominio).subscribe(response => {
          this.condominio = response as Condominio;
          this.toastService.addToast('success', 'Cadastro Condomínio!', `Condomínio ${this.condominio.nome} salvo com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Cadastro Condomínio!', element.mensagemUsuario);
          });
        }, () => this.spinner.hide())
      } else {
        this.defaultService.atualizar('condominios', this.condominio).subscribe(response => {
          this.condominio = response as Condominio;
          this.toastService.addToast('success', 'Atualização Condomínio!', `Condomínio ${this.condominio.nome} atualizado com sucesso!`);
        }, error => {
          console.error(error)
          error.error.forEach(element => {
            this.toastService.addToast('error', 'Atualização Condomínio!', element.mensagemUsuario);
          });
        }, () => this.spinner.hide())
      }
    }
  }
}
