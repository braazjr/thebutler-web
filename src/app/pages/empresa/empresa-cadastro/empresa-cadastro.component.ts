import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Empresa } from '../../../models/empresa-model';
import { DefaultService } from '../../../services/default.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { SharedService } from 'src/app/shared/shared.service';
import { EmpresaConfig } from 'src/app/models/empresa-config';

@Component({
  selector: 'app-empresa-cadastro',
  templateUrl: './empresa-cadastro.component.html',
  styleUrls: ['./empresa-cadastro.component.scss']
})
export class EmpresaCadastroComponent implements OnInit {

  position = 'bottom-right';

  empresa: Empresa = new Empresa();

  cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  telefoneMask = ['(', /[1-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cnpjRegex = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
  cepRegex = /^\d{5}-\d{3}$/;
  telefoneRegex = /^\(\d{2}\)\d{4}-\d{4}$/;
  formulario: FormGroup;
  isSubmit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private defaultService: DefaultService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.empresa.id = params['id'];
        this.getById(params['id']);
      }
    });

    this.formulario = this.formBuilder.group({
      id: ['', []],
      cnpj: ['', [Validators.required, Validators.pattern(this.cnpjRegex)]],
      nomeFantasia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ativo: [true, [Validators.required]],
      razaoSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bairro: [{ value: '', disabled: true }, []],
      cidade: [{ value: '', disabled: true }, []],
      estado: [{ value: '', disabled: true }, []],
      cep: ['', [Validators.required, Validators.pattern(this.cepRegex)]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(this.telefoneRegex)]],
      complemento: ['', [Validators.maxLength(50)]],
      rua: [{ value: '', disabled: true }, []],
      numero: ['', [Validators.min(1)]],
      empresaConfig: this.formBuilder.group({
        id: ['', []],
        qtyApartamentos: ['', [Validators.required]]
      })
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getById(id) {
    this.defaultService.getById('empresas', id)
      .subscribe(response => {
        this.empresa = response as Empresa;

        if (!this.empresa.empresaConfig)
          this.empresa.empresaConfig = new EmpresaConfig();

        this.formulario.patchValue(this.empresa);
      });
  }

  validaCep(value) {
    let cep: string = value.target.value.replace('_', '');
    if (cep.length == 9)
      this.buscaCep(cep.replace('-', ''));
  }

  buscaCep(cep) {
    this.defaultService.getDadosCep(cep)
      .subscribe(response => {
        this.formulario.get('rua').setValue(response['logradouro']);
        this.formulario.get('bairro').setValue(response['bairro']);
        this.formulario.get('cidade').setValue(response['localidade']);
        this.formulario.get('estado').setValue(response['uf']);
        this.formulario.get('complemento').setValue(response['complemento']);
      });
  }

  isValid(field) {
    return this.formulario.get(field).status == 'VALID' ? true : false;
  }

  salvar() {
    if (this.formulario.invalid) {
      this.isSubmit = true;
      return;
    } else {
      this.empresa = this.formulario.getRawValue();
      this.empresa.usuario = this.sharedService.getUsuarioLogged();

      if (!this.empresa.id) {
        this.defaultService.salvar('empresas', this.empresa)
          .subscribe(response => {
            this.empresa = response as Empresa;
            this.toastService.addToast('success', 'Cadastro Empresa!', `Empresa ${this.empresa.nomeFantasia} salva com sucesso!`);
          });
      } else {
        this.defaultService.atualizar('empresas', this.empresa)
          .subscribe(response => {
            this.empresa = response as Empresa;
            this.toastService.addToast('success', 'Atualização Empresa!', `Empresa ${this.empresa.nomeFantasia} atualizada com sucesso!`);
          });
      }
    }
  }
}
